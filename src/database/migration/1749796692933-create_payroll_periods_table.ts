import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePayrollPeriodsTable1749796692933 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "payroll_period_status" AS ENUM (
                'DRAFT',
                'PROCESSING',
                'COMPLETED'
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "payroll_periods" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "start_date" date NOT NULL,
                "end_date" date NOT NULL,
                "status" payroll_period_status NOT NULL,
                "eligible_employee_count" integer DEFAULT 0,
                "processed_employee_count" integer DEFAULT 0,
                "failed_employee_count" integer DEFAULT 0,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payroll_periods"`);
        await queryRunner.query(`DROP TYPE "payroll_period_status"`);
    }
}
