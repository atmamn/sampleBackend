import { Router } from "express";
const router = Router();

import { authenticateUser } from "../../controllers/users/authForWebSocket";
import { changePassword } from "../../controllers/users/changePassword";
import { createUser } from "../../controllers/users/createUser";
import { forgotPassword1stStep } from "../../controllers/users/forgotPassword";
import { forgotPassword3rdStep } from "../../controllers/users/forgotPassword3";
import { login } from "../../controllers/users/login";
import { logout } from "../../controllers/users/logout";
import { getProfile } from "../../controllers/users/profile/get";
import { getLimitedInfoProfile } from "../../controllers/users/profile/getEventsLimitedInfo";
import { getLimitedVenuesInfoProfile } from "../../controllers/users/profile/getVenuesLimitedInfo";
import { searchEvent } from "../../controllers/users/profile/searchEvents";
import { searchVenues } from "../../controllers/users/profile/searchVenues";
import { updateProfile } from "../../controllers/users/profile/update";
import { updateImg } from "../../controllers/users/profile/updateImg";
import protect from "../../middleware/auth/protect";
import { forgotPassword2ndStep } from "../../controllers/users/forgotPassword2";

router.post("/", createUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/change-password", protect, changePassword);
router.post("/forgot-password-1st-step", forgotPassword1stStep);
router.post("/forgot-password-2nd-step", forgotPassword2ndStep);
router.post("/forgot-password-3rd-step", forgotPassword3rdStep);
router.get("/getProfile", getProfile);
router.patch("/updateProfile", protect, updateProfile);
router.get("/getLimitedInfoProfile", getLimitedInfoProfile);
router.patch("/updateImg", protect, updateImg);
router.get("/searchEvent", searchEvent);
router.get("/getLimitedVenuesInfoProfile", getLimitedVenuesInfoProfile);
router.get("/searchVenues", searchVenues);
router.get("/authWorker", authenticateUser);

export default router;
