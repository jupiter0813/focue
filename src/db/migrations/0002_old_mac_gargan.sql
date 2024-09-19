CREATE TABLE IF NOT EXISTS "timers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"started_at" timestamp NOT NULL,
	"stopped_at" timestamp,
	"duration" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timers" ADD CONSTRAINT "timers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
