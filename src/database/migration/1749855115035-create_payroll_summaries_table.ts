import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePayrollSummariesTable1749855115035 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "payroll_summaries",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "payroll_period_id",
                        type: "uuid",
                    },
                    {
                        name: "employee_id",
                        type: "uuid",
                    },
                    {
                        name: "take_home_pay_amount",
                        type: "numeric",
                        precision: 15,
                        scale: 2,
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

        await queryRunner.createForeignKey(
            "payroll_summaries",
            new TableForeignKey({
                columnNames: ["payroll_period_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "payroll_periods",
            })
        );

        await queryRunner.createForeignKey(
            "payroll_summaries",
            new TableForeignKey({
                columnNames: ["employee_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "employees",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("payroll_summaries");
    }
}
