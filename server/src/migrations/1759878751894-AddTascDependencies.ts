import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTascDependencies1759878751894 implements MigrationInterface {
    name = 'AddTascDependencies1759878751894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_dependencies" ("taskid" uuid NOT NULL, "dependencyId" uuid NOT NULL, CONSTRAINT "PK_d8fd2089a5221a259bc0c0d15e1" PRIMARY KEY ("taskid", "dependencyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c616cf47714e0ab32a473ef5f0" ON "task_dependencies" ("taskid") `);
        await queryRunner.query(`CREATE INDEX "IDX_120b6b458f19c79746a028d019" ON "task_dependencies" ("dependencyId") `);
        await queryRunner.query(`ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_c616cf47714e0ab32a473ef5f0a" FOREIGN KEY ("taskid") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_120b6b458f19c79746a028d0195" FOREIGN KEY ("dependencyId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_120b6b458f19c79746a028d0195"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_c616cf47714e0ab32a473ef5f0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_120b6b458f19c79746a028d019"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c616cf47714e0ab32a473ef5f0"`);
        await queryRunner.query(`DROP TABLE "task_dependencies"`);
    }

}
