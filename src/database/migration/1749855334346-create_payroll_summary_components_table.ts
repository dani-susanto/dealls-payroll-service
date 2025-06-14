import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePayrollSummaryComponentsTable1749855334346 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "payroll_summary_component_payment_type" AS ENUM (
                'SALARY',
                'OVERTIME',
                'REIMBURSEMENT'
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "payroll_summary_components" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "payroll_summary_id" uuid,
                "payment_type" payroll_summary_component_payment_type NOT NULL,
                "amount" numeric(15,2) DEFAULT 0,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("payroll_summary_id") REFERENCES "payroll_summaries"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payroll_summary_components"`);
        await queryRunner.query(`DROP TYPE "payroll_summary_component_payment_type"`);
    }
}
