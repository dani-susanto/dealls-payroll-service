import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePayrollSummariesTable1749855115035 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "payroll_summaries" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "payroll_period_id" uuid,
                "employee_id" uuid,
                "take_home_pay_amount" numeric(15,2) DEFAULT 0,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("payroll_period_id") REFERENCES "payroll_periods"("id"),
                FOREIGN KEY ("employee_id") REFERENCES "employees"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payroll_summaries"`);
    }
}
