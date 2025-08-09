import { Router } from "express";
import {
  login,
  register,
  sendPasswordResetOtp,
  resetPasswordWithOtp,
} from "./controllers/auth";
import {
  getLocations,
  getLocationsWarehouse,
  getLocationsRack,
  getLocationStatus,
} from "./controllers/locations";
import { getWarehouses, assignLocation } from "./controllers/warehouse";
import { getRacksByWarehouse } from "./controllers/rack";
import {
  createCargo,
  getCargo,
  transferCargoController,
  deliverCargoController,
} from "./controllers/cargo";
import {
  listUsers,
  createUserWithRolesController,
  addRolesToUserController,
  replaceUserRolesController,
  getUserDetailsController,
  getUserPermissionsController,
  patchUserController
} from "./controllers/users";
import {
  allPermisions,
  allRoles,
  rolesWithPermissions,
} from "./controllers/roles-permissions";
import { getSessionLogs } from "./controllers/session";
import { getDashboardData } from "./controllers/dashboard";
import {
  getCargoEntryReport,
  getCargoExitReport,
  getCargoTransferReport,
  getDistributionByLocationReport,
  getCargoReturnReentryReport,
  getAverageCargoStayReport,
  getDailyCargoByTypeReport,
} from "./controllers/reports";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password/send-otp", sendPasswordResetOtp);
router.post("/forgot-password/reset", resetPasswordWithOtp);
router.get("/locations", getLocations);
router.get("/locations/:warehouse", getLocationsWarehouse);
router.get("/locations/status/:status", getLocationStatus);
router.get("/warehouses", getWarehouses);
router.get("/racks/:warehouse", getRacksByWarehouse);
router.get("/locations-rack/:rack", getLocationsRack);
router.post("/cargo", createCargo);
router.post("/cargo-assign-location", assignLocation);
router.get("/cargo", getCargo);
router.post("/cargo-transfer", transferCargoController);
router.post("/cargo-deliver", deliverCargoController);
router.get("/users", listUsers);
router.get("/permissions", allPermisions);
router.get("/roles", allRoles);
router.get("/roles-permissions", rolesWithPermissions);
router.get("/api/sessions", getSessionLogs);
router.get("/dashboard", getDashboardData);
router.get("/reports/cargo-entry", getCargoEntryReport);
router.get("/reports/cargo-exit", getCargoExitReport);
router.get("/reports/cargo-transfer", getCargoTransferReport);
router.get(
  "/reports/distribution-by-location",
  getDistributionByLocationReport
);
router.get("/reports/cargo-return-reentry", getCargoReturnReentryReport);
router.get("/reports/cargo-average", getAverageCargoStayReport);
router.get("/reports/cargo-type", getDailyCargoByTypeReport);
router.post("/users", createUserWithRolesController);
router.post("/users/:userId/roles", addRolesToUserController);
router.put("/users/:userId/roles", replaceUserRolesController);
router.get("/users/:userId", getUserDetailsController);
router.get("/users/:userId/permissions", getUserPermissionsController);
router.patch("/users/:userId", patchUserController);

export { router };
