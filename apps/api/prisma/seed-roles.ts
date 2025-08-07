import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

const roles = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso total al sistema. Puede gestionar usuarios, roles, permisos y operaciones críticas.'
  },
  {
    id: 'digitador',
    name: 'Digitador',
    description: 'Responsable de ingresar cargas al sistema.'
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Puede revisar, editar y transferir cargas.'
  },
  {
    id: 'talonador',
    name: 'Talonador',
    description: 'Registra y visualiza las cargas asignadas.'
  },
  {
    id: 'operador',
    name: 'Operador',
    description: 'Encargado de transferencias y entregas de carga.'
  },
  {
    id: 'auditor',
    name: 'Auditor',
    description: 'Solo lectura de información para fines de auditoría.'
  },
  {
    id: 'cliente',
    name: 'Cliente',
    description: 'Visualiza únicamente sus propias cargas.'
  }
]

const permissions = [
  {
    id: 'cargo.register',
    name: 'Registrar carga',
    description: 'Permite registrar una nueva carga en el sistema.'
  },
  {
    id: 'cargo.view',
    name: 'Ver carga',
    description: 'Permite visualizar la información de cargas registradas.'
  },
  {
    id: 'cargo.edit',
    name: 'Editar carga',
    description: 'Permite modificar la información de una carga existente.'
  },
  {
    id: 'cargo.transfer',
    name: 'Transferir carga',
    description: 'Permite mover cargas entre almacenes o ubicaciones.'
  },
  {
    id: 'cargo.deliver',
    name: 'Entregar carga',
    description: 'Permite registrar la entrega final de una carga al destinatario.'
  },
  {
    id: 'user.manage',
    name: 'Gestionar usuarios',
    description: 'Permite crear, modificar o desactivar cuentas de usuario.'
  },
  {
    id: 'role.manage',
    name: 'Gestionar roles',
    description: 'Permite crear, editar o eliminar roles en el sistema.'
  },
  {
    id: 'permission.manage',
    name: 'Gestionar permisos',
    description: 'Permite asignar o modificar los permisos de los roles.'
  }
]

const rolePermissions: Record<string, string[]> = {
  admin: [
    'cargo.register',
    'cargo.view',
    'cargo.edit',
    'cargo.transfer',
    'cargo.deliver',
    'user.manage',
    'role.manage',
    'permission.manage'
  ],
  digitador: ['cargo.register', 'cargo.view'],
  supervisor: ['cargo.view', 'cargo.edit', 'cargo.transfer'],
  talonador: ['cargo.register', 'cargo.view'],
  operador: ['cargo.transfer', 'cargo.deliver'],
  auditor: ['cargo.view'],
  cliente: ['cargo.view']
}

async function main() {
  console.log('🌱 Seeding roles...')
  for (const role of roles) {
    await prisma.roles.upsert({
      where: { Id: role.id },
      update: {
        Name: role.name,
        Description: role.description
      },
      create: {
        Id: role.id,
        Name: role.name,
        Description: role.description
      }
    })
  }

  console.log('🌱 Seeding permissions...')
  for (const permission of permissions) {
    await prisma.permissions.upsert({
      where: { Id: permission.id },
      update: {
        Name: permission.name,
        Description: permission.description
      },
      create: {
        Id: permission.id,
        Name: permission.name,
        Description: permission.description
      }
    })
  }

  console.log('🔗 Linking roles to permissions...')
  for (const [roleId, permissionIds] of Object.entries(rolePermissions)) {
    for (const permissionId of permissionIds) {
      await prisma.rolePermissions.upsert({
        where: {
          RoleId_PermissionId: {
            RoleId: roleId,
            PermissionId: permissionId
          }
        },
        update: {},
        create: {
          RoleId: roleId,
          PermissionId: permissionId
        }
      })
    }
  }

  console.log('✅ Seed completo.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
