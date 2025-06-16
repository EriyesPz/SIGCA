-- CreateTable
CREATE TABLE "Categories" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Icon" TEXT,
    "Color" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CategoryId" TEXT,
    "Location" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Racks" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "WarehouseId" TEXT NOT NULL,
    "Capacity" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,

    CONSTRAINT "Racks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RackLevels" (
    "Id" TEXT NOT NULL,
    "RackId" TEXT NOT NULL,
    "LevelNumber" INTEGER NOT NULL,

    CONSTRAINT "RackLevels_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RackColumns" (
    "Id" TEXT NOT NULL,
    "LevelId" TEXT NOT NULL,
    "ColumnNumber" INTEGER NOT NULL,

    CONSTRAINT "RackColumns_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Cargo" (
    "Id" TEXT NOT NULL,
    "TrackingCode" TEXT NOT NULL,
    "Description" TEXT,
    "Status" TEXT NOT NULL,
    "WeightKg" DOUBLE PRECISION NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "EntryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ExitDate" TIMESTAMP(3),
    "IsPerishable" BOOLEAN NOT NULL DEFAULT false,
    "WarehouseId" TEXT NOT NULL,
    "RackId" TEXT NOT NULL,
    "LevelId" TEXT NOT NULL,
    "ColumnId" TEXT NOT NULL,
    "CreatedBy" TEXT,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CargoDocuments" (
    "Id" TEXT NOT NULL,
    "CargoId" TEXT NOT NULL,
    "FileUrl" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Metadata" JSONB,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,

    CONSTRAINT "CargoDocuments_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Deliveries" (
    "Id" TEXT NOT NULL,
    "CargoId" TEXT NOT NULL,
    "Receiver" TEXT NOT NULL,
    "DeliveredAt" TIMESTAMP(3) NOT NULL,
    "VerifiedBy" TEXT NOT NULL,
    "DeliveredBy" TEXT,

    CONSTRAINT "Deliveries_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Transfers" (
    "Id" TEXT NOT NULL,
    "CargoId" TEXT NOT NULL,
    "FromWarehouseId" TEXT NOT NULL,
    "ToWarehouseId" TEXT NOT NULL,
    "TransferDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Notes" TEXT,
    "TransferredBy" TEXT,

    CONSTRAINT "Transfers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Alerts" (
    "Id" TEXT NOT NULL,
    "CargoId" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Message" TEXT,
    "TriggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Resolved" BOOLEAN NOT NULL DEFAULT false,
    "TriggeredBy" TEXT,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CargoStatusHistory" (
    "Id" TEXT NOT NULL,
    "CargoId" TEXT NOT NULL,
    "PreviousStatus" TEXT,
    "NewStatus" TEXT NOT NULL,
    "ChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ChangedBy" TEXT,

    CONSTRAINT "CargoStatusHistory_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CargoLocationHistory" (
    "Id" TEXT NOT NULL,
    "CargoId" TEXT NOT NULL,
    "FromRackId" TEXT,
    "FromLevelId" TEXT,
    "FromColumnId" TEXT,
    "ToRackId" TEXT,
    "ToLevelId" TEXT,
    "ToColumnId" TEXT,
    "MovedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "MovedBy" TEXT,

    CONSTRAINT "CargoLocationHistory_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_TrackingCode_key" ON "Cargo"("TrackingCode");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Categories"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Racks" ADD CONSTRAINT "Racks_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "Warehouse"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Racks" ADD CONSTRAINT "Racks_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RackLevels" ADD CONSTRAINT "RackLevels_RackId_fkey" FOREIGN KEY ("RackId") REFERENCES "Racks"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RackColumns" ADD CONSTRAINT "RackColumns_LevelId_fkey" FOREIGN KEY ("LevelId") REFERENCES "RackLevels"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD CONSTRAINT "Cargo_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "Warehouse"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD CONSTRAINT "Cargo_RackId_fkey" FOREIGN KEY ("RackId") REFERENCES "Racks"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD CONSTRAINT "Cargo_LevelId_fkey" FOREIGN KEY ("LevelId") REFERENCES "RackLevels"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD CONSTRAINT "Cargo_ColumnId_fkey" FOREIGN KEY ("ColumnId") REFERENCES "RackColumns"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD CONSTRAINT "Cargo_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoDocuments" ADD CONSTRAINT "CargoDocuments_CargoId_fkey" FOREIGN KEY ("CargoId") REFERENCES "Cargo"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoDocuments" ADD CONSTRAINT "CargoDocuments_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliveries" ADD CONSTRAINT "Deliveries_CargoId_fkey" FOREIGN KEY ("CargoId") REFERENCES "Cargo"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliveries" ADD CONSTRAINT "Deliveries_DeliveredBy_fkey" FOREIGN KEY ("DeliveredBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_CargoId_fkey" FOREIGN KEY ("CargoId") REFERENCES "Cargo"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_FromWarehouseId_fkey" FOREIGN KEY ("FromWarehouseId") REFERENCES "Warehouse"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_ToWarehouseId_fkey" FOREIGN KEY ("ToWarehouseId") REFERENCES "Warehouse"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_TransferredBy_fkey" FOREIGN KEY ("TransferredBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_CargoId_fkey" FOREIGN KEY ("CargoId") REFERENCES "Cargo"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_TriggeredBy_fkey" FOREIGN KEY ("TriggeredBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoStatusHistory" ADD CONSTRAINT "CargoStatusHistory_CargoId_fkey" FOREIGN KEY ("CargoId") REFERENCES "Cargo"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoStatusHistory" ADD CONSTRAINT "CargoStatusHistory_ChangedBy_fkey" FOREIGN KEY ("ChangedBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoLocationHistory" ADD CONSTRAINT "CargoLocationHistory_CargoId_fkey" FOREIGN KEY ("CargoId") REFERENCES "Cargo"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoLocationHistory" ADD CONSTRAINT "CargoLocationHistory_MovedBy_fkey" FOREIGN KEY ("MovedBy") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
