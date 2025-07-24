-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkId" TEXT NOT NULL,
    "activeModuleId" TEXT,
    "activeQuestionId" TEXT,
    "dailyGoal" TEXT,
    "onboardingOptions" JSONB,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_activeModuleId_fkey" FOREIGN KEY ("activeModuleId") REFERENCES "Module" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_activeQuestionId_fkey" FOREIGN KEY ("activeQuestionId") REFERENCES "Question" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("activeModuleId", "activeQuestionId", "clerkId", "createdAt", "dailyGoal", "id", "onboardingOptions", "updatedAt") SELECT "activeModuleId", "activeQuestionId", "clerkId", "createdAt", "dailyGoal", "id", "onboardingOptions", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
