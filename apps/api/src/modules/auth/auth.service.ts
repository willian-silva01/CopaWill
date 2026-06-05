import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictException('E-mail já cadastrado');

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) throw new ConflictException('Username já está em uso');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        passwordHash,
      },
      select: { id: true, name: true, email: true, username: true, role: true },
    });

    // TODO: Enviar e-mail de confirmação via fila (Bull)

    return { message: 'Conta criada! Verifique seu e-mail para confirmar.', user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Conta bloqueada. Entre em contato com o suporte.');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
  }

  async refreshToken(token: string) {
    const hashedToken = await bcrypt.hash(token, 1);

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash: { not: undefined }, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!storedToken) throw new UnauthorizedException('Token inválido ou expirado');

    const isValid = await bcrypt.compare(token, storedToken.tokenHash);
    if (!isValid) throw new UnauthorizedException('Token inválido');

    // Revogar o token atual (rotação)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const { user } = storedToken;
    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logout realizado com sucesso' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Resposta genérica para não revelar se o e-mail existe
    if (!user) return { message: 'Se o e-mail existir, você receberá as instruções em breve.' };

    const rawToken = uuidv4();
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // TODO: Enviar e-mail com link de redefinição via fila (Bull)

    return { message: 'Se o e-mail existir, você receberá as instruções em breve.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetTokens = await this.prisma.passwordResetToken.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
    });

    let validToken = null;
    for (const t of resetTokens) {
      if (await bcrypt.compare(token, t.tokenHash)) {
        validToken = t;
        break;
      }
    }

    if (!validToken) throw new BadRequestException('Token inválido ou expirado');

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: validToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: validToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Senha redefinida com sucesso' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });

    const rawRefreshToken = uuidv4();
    const tokenHash = await bcrypt.hash(rawRefreshToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 dias

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }
}
