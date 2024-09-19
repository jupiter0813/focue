/// <reference path="../.astro/types.d.ts" />
declare namespace App {
    interface Locals {
        user:
            | {
                  email: string | undefined;
                  id: string;
              }
            | undefined;
    }
}
