import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePayrollSummaryComponentsTable1749855334346 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "payroll_summary_component_payment_type" AS ENUM (
                'SALARY',
                'OVERTIME',
                'REIMBURSEMENT'
            )
        `);

        await queryRunner.createTable(
            new Table({
                name: "payroll_summary_components",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "payroll_summary_id",
                        type: "uuid",
                    },
                    {
                        name: "payment_type",
                        type: "payroll_summary_component_payment_type",
                        isNullable: false,
                    },
                    {
                        name: "amount",
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
            "payroll_summary_components",
            new TableForeignKey({
                columnNames: ["payroll_summary_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "payroll_summaries",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("payroll_summary_components");
        await queryRunner.query(`DROP TYPE "payroll_summary_component_payment_type"`);
    }
}
