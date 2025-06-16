import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePayrollPeriodsTable1749796692933 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "payroll_period_status" AS ENUM (
                'DRAFT',
                'PROCESSING',
                'COMPLETED'
            )
        `);

        await queryRunner.createTable(
            new Table({
                name: "payroll_periods",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "start_date",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "end_date",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "payroll_period_status",
                        isNullable: false,
                    },
                    {
                        name: "eligible_employee_count",
                        type: "integer",
                        default: 0,
                    },
                    {
                        name: "processed_employee_count",
                        type: "integer",
                        default: 0,
                    },
                    {
                        name: "failed_employee_count",
                        type: "integer",
                        default: 0,
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
        await queryRunner.dropTable("payroll_periods");
        await queryRunner.query(`DROP TYPE "payroll_period_status"`);
    }
}
