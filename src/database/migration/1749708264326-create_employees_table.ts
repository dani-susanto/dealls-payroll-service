import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEmployeesTable1749708264326 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            CREATE TYPE "employee_status" AS ENUM ('ACTIVE', 'INACTIVE')
        `);

        await queryRunner.createTable(
            new Table({
                name: "employees",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "200",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "150",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "basic_salary_amount",
                        type: "numeric",
                        precision: 15,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: "status",
                        type: "employee_status",
                        default: "'ACTIVE'",
                    },
                    {
                        name: "created_by",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("employees");
        await queryRunner.query(`DROP TYPE "employee_status"`);
    }
}
