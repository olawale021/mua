-- CreateTable
CREATE TABLE "SephoraCache" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SephoraCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SephoraCache_expiresAt_idx" ON "SephoraCache"("expiresAt");
