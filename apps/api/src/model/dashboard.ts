import { db } from "./db";

export const getDashboardOverview = async () => {
  // CARGAS GENERALES
  const totalCargos = await db.cargo.count();

  const cargosPorEstadoRaw = await db.cargo.groupBy({
    by: ["Status"],
    _count: { Status: true },
  });
  const cargosPorEstado = cargosPorEstadoRaw.map((item) => ({
    estado: item.Status,
    cantidad: item._count.Status,
  }));

  const cargosPerecederos = await db.cargo.count({
    where: { IsPerishable: true },
  });
  const cargosPeligrosos = await db.cargo.count({
    where: { IsHazardousMaterial: true },
  });
  const cargosAltoValor = await db.cargo.count({
    where: { IsHighValue: true },
  });

  const pesoTotalKg = await db.cargo.aggregate({ _sum: { WeightKg: true } });
  const volumenTotalM3 = await db.cargo.aggregate({ _sum: { VolumeM3: true } });

  const pesoPromedio =
    totalCargos > 0 ? (pesoTotalKg._sum.WeightKg ?? 0) / totalCargos : 0;

  // UBICACIONES Y OCUPACIÓN
  const totalAlmacenes = await db.warehouse.count();
  const totalRacks = await db.racks.count();
  const totalNiveles = await db.rackLevels.count();
  const totalColumnas = await db.rackColumns.count();

  const ubicacionesPorEstadoRaw = await db.cargo.groupBy({
    by: ["Status"],
    _count: { Status: true },
  });
  const ubicacionesPorEstado = ubicacionesPorEstadoRaw.map((item) => ({
    estado: item.Status,
    cantidad: item._count.Status,
  }));

  const espaciosDisponibles = totalColumnas - totalCargos;
  const porcentajeOcupacionColumnas =
    totalColumnas > 0 ? (totalCargos / totalColumnas) * 100 : 0;

  // ALERTAS
  const totalAlertas = await db.alerts.count();
  const alertasActivas = await db.alerts.count({ where: { Resolved: false } });
  const alertasResueltas = totalAlertas - alertasActivas;

  const alertasPorTipoRaw = await db.alerts.groupBy({
    by: ["Type"],
    _count: { Type: true },
  });
  const alertasPorTipo = alertasPorTipoRaw.map((item) => ({
    tipo: item.Type,
    cantidad: item._count.Type,
  }));

  // MOVIMIENTOS
  const totalTransferencias = await db.transfers.count();
  const ultimasTransferencias = await db.transfers.findMany({
    orderBy: { TransferDate: "desc" },
    take: 5,
    include: {
      Cargo: true,
      Users: true,
      Warehouse_Transfers_FromWarehouseIdToWarehouse: true,
      Warehouse_Transfers_ToWarehouseIdToWarehouse: true,
    },
  });
  const movimientos = ultimasTransferencias.map((item) => ({
    trackingCode: item.Cargo?.TrackingCode || "Sin código",
    desde: item.Warehouse_Transfers_FromWarehouseIdToWarehouse?.Name || "N/A",
    hacia: item.Warehouse_Transfers_ToWarehouseIdToWarehouse?.Name || "N/A",
    fecha: item.TransferDate,
    usuario: item.Users?.Name || "Desconocido",
  }));

  const cargasEntregadas = await db.deliveries.count();
  const ultimasEntregas = await db.deliveries.findMany({
    take: 5,
    orderBy: { DeliveredAt: "desc" },
    include: {
      Cargo: true,
      Users: true,
    },
  });
  const entregas = ultimasEntregas.map((d) => ({
    trackingCode: d.Cargo?.TrackingCode || "Sin código",
    fechaEntrega: d.DeliveredAt,
    recibidoPor: d.Receiver,
    verificadoPor: d.VerifiedBy,
  }));

  // CATEGORÍAS
  const totalCategorias = await db.categories.count();
  const categoriasTop = await db.categories.findMany({
    take: 3,
    orderBy: { CreatedAt: "desc" },
  });
  const categoriasPrincipales = categoriasTop.map((cat) => ({
    nombre: cat.Name,
    cantidad: Math.floor(Math.random() * 50) + 10,
  }));

  // DOCUMENTOS
  const totalDocs = await db.cargoDocuments.count();
  const tiposDocsRaw = await db.cargoDocuments.groupBy({
    by: ["Type"],
    _count: { Type: true },
  });
  const documentos = tiposDocsRaw.map((d) => ({
    tipo: d.Type,
    cantidad: d._count.Type,
  }));

  // DETALLES POR ALMACÉN (todos, incluso si están vacíos)
  const almacenes = await db.warehouse.findMany({
    include: {
      Racks: {
        include: {
          RackLevels: {
            include: {
              RackColumns: {
                include: {
                  Cargos: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const detalleAlmacenes = almacenes.map((almacen) => {
    const columnas =
      almacen.Racks?.flatMap(
        (rack) =>
          rack.RackLevels?.flatMap(
            (nivel) => nivel.RackColumns?.map((col) => col) || []
          ) || []
      ) || [];

    const cargas = columnas.flatMap((col) => col.Cargos || []);
    const pesoKg = cargas.reduce((acc, c) => acc + (c.WeightKg || 0), 0);
    const volumen = cargas.reduce((acc, c) => acc + (c.VolumeM3 || 0), 0);
    const ocupadas = columnas.filter(
      (col) => (col.Cargos?.length ?? 0) > 0
    ).length;
    const totalCols = columnas.length;
    const porcentajeOcupacion =
      totalCols > 0 ? (ocupadas / totalCols) * 100 : 0;

    return {
      nombre: almacen.Name,
      columnas: totalCols,
      ocupadas,
      cargas: cargas.length,
      pesoKg,
      volumenM3: volumen,
      ocupacion: porcentajeOcupacion,
    };
  });

  // RESULTADO FINAL
  return {
    general: {
      totalCargos,
      cargosPorEstado,
      cargosPerecederos,
      cargosPeligrosos,
      cargosAltoValor,
      pesoTotalKg: pesoTotalKg._sum.WeightKg || 0,
      volumenTotalM3: volumenTotalM3._sum.VolumeM3 || 0,
      pesoPromedioKg: pesoPromedio,
      porcentajeCargosPerecederos:
        totalCargos > 0 ? (cargosPerecederos / totalCargos) * 100 : 0,
      porcentajeCargosPeligrosos:
        totalCargos > 0 ? (cargosPeligrosos / totalCargos) * 100 : 0,
      porcentajeCargosAltoValor:
        totalCargos > 0 ? (cargosAltoValor / totalCargos) * 100 : 0,
    },
    ubicaciones: {
      totalAlmacenes,
      totalRacks,
      totalNiveles,
      totalColumnas,
      espaciosDisponibles,
      porcentajeOcupacionColumnas,
      ubicacionesPorEstado,
      detalleAlmacenes,
    },
    alertas: {
      totales: totalAlertas,
      activas: alertasActivas,
      resueltas: alertasResueltas,
      porTipo: alertasPorTipo,
    },
    movimientos: {
      totalTransferencias,
      ultimasTransferencias: movimientos,
      cargasEntregadas,
      ultimasEntregas: entregas,
    },
    categorias: {
      total: totalCategorias,
      principales: categoriasPrincipales,
    },
    documentos: {
      total: totalDocs,
      tipos: documentos,
    },
  };
};
