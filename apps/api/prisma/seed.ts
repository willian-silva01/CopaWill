import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Admin padrão
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@copawill.com' },
    update: {},
    create: {
      name: 'Administrador',
      username: 'admin',
      email: 'admin@copawill.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Admin criado:', admin.email);

  // Usuário de teste
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'teste@copawill.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      username: 'testeteste',
      email: 'teste@copawill.com',
      passwordHash: userPassword,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Usuário teste criado:', user.email);

  // Times de exemplo
  const teams = await Promise.all([
    prisma.team.upsert({
      where: { id: 'brazil-id' },
      update: {},
      create: { id: 'brazil-id', name: 'Brasil', shortName: 'BRA', country: 'Brasil' },
    }),
    prisma.team.upsert({
      where: { id: 'argentina-id' },
      update: {},
      create: { id: 'argentina-id', name: 'Argentina', shortName: 'ARG', country: 'Argentina' },
    }),
    prisma.team.upsert({
      where: { id: 'france-id' },
      update: {},
      create: { id: 'france-id', name: 'França', shortName: 'FRA', country: 'França' },
    }),
    prisma.team.upsert({
      where: { id: 'germany-id' },
      update: {},
      create: { id: 'germany-id', name: 'Alemanha', shortName: 'ALE', country: 'Alemanha' },
    }),
  ]);
  console.log(`✅ ${teams.length} times criados`);

  console.log('🎉 Seed finalizado!');
  console.log('\nCredenciais de acesso:');
  console.log('  Admin: admin@copawill.com / admin123');
  console.log('  Usuário: teste@copawill.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
