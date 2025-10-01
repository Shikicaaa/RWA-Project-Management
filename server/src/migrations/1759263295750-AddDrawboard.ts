import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDrawboard1759263295750 implements MigrationInterface {
    name = 'AddDrawboard1759263295750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "drawboardState" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "drawboardState"`);
    }

}
