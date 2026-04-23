CREATE TABLE "appointment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"reason" text NOT NULL,
	"visit_type" text DEFAULT 'Video visit' NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"specialty" text NOT NULL,
	"subspecialty" text,
	"bio" text,
	"image_url" text,
	"rating" text DEFAULT '4.8' NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"years" integer DEFAULT 0 NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"next_available" text DEFAULT 'Today' NOT NULL,
	"slots_by_day" text DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;