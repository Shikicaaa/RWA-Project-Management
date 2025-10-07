import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCreatorToTask1759846863941 implements MigrationInterface {
    name = 'AddedCreatorToTask1759846863941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "drawboardState" TO "creatorId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "creatorId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_90bc62e96b48a437a78593f78f0" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_90bc62e96b48a437a78593f78f0"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "creatorId" text`);
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "creatorId" TO "drawboardState"`);
    }

}
