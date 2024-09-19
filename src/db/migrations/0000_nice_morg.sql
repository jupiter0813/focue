CREATE TABLE IF NOT EXISTS "user_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"stripe_customer_email" text NOT NULL,
	"plan" text NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_purchases_stripe_customer_email_unique" UNIQUE("stripe_customer_email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'USER' NOT NULL,
	"plan" text DEFAULT 'FREE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
