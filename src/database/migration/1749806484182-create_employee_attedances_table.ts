import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeAttedancesTable1749806484182 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "employee_attendances" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "employee_id" uuid,
                "attendance_date" date NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("employee_id") REFERENCES "employees"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee_attendances"`);
    }
}
