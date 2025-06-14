import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeReimbursementsTable1749827541614 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "employee_reimbursements" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "employee_id" uuid,
                "reimbursement_date" date NOT NULL,
                "amount" numeric(15,2) DEFAULT 0,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("employee_id") REFERENCES "employees"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee_reimbursements"`);
    }
}
