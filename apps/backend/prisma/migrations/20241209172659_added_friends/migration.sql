-- CreateTable
CREATE TABLE "_Friend Requests" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Friend Requests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Friend Requests_B_index" ON "_Friend Requests"("B");

-- AddForeignKey
ALTER TABLE "_Friend Requests" ADD CONSTRAINT "_Friend Requests_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friend Requests" ADD CONSTRAINT "_Friend Requests_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
