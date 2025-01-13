import { Router } from "express";
import { checkIsAdmin } from "../../controllers/admin/checkIsAdmin";
import { adminList } from "../../controllers/users/adminList";
import { deleteUser } from "../../controllers/users/admin/deleteUser";
import { eventList } from "../../controllers/users/admin/eventList";
import { deleteEvent } from "../../controllers/users/admin/deleteEvent";
import { venueList } from "../../controllers/users/admin/venueList";
import { deleteVenue } from "../../controllers/users/admin/deleteVenue";
import { eventServiceList } from "../../controllers/users/admin/eventServiceList";
import { deleteEventServices } from "../../controllers/users/admin/deleteEventServices";
import { storiesList } from "../../controllers/users/admin/storiesList";
import { deleteStory } from "../../controllers/users/admin/deleteStories";
import { shortVidList } from "../../controllers/users/admin/shortVidsList";
import { deleteShortVid } from "../../controllers/users/admin/deleteShortVid";
import { groupsList } from "../../controllers/users/admin/groupsList";
import { deleteGroup } from "../../controllers/users/admin/deleteGroup";
import { reviewsList } from "../../controllers/users/admin/reviewsList";
import { groupPostList } from "../../controllers/users/admin/groupPostList";
import { deleteGroupPost } from "../../controllers/users/admin/deleteGroupPost";
import { groupPostCommentList } from "../../controllers/users/admin/groupPostCommentList";
import { deleteGroupPostComment } from "../../controllers/users/admin/deleteGroupPostComment";
import { verifyEventService } from "../../controllers/users/admin/verifyService";
import { unVerifyEventService } from "../../controllers/users/admin/unVerify";
import { blackListEvent } from "../../controllers/users/admin/eventBlacklist";
import { addAdvert } from "../../controllers/users/admin/addAdvert";
import { getAdvert } from "../../controllers/users/getAdvert";
import { deleteAdvert } from "../../controllers/users/admin/deleteAdvert";

const router = Router();

router.get("/", checkIsAdmin);
router.get("/adminList", adminList);
router.delete("/deleteUser/:user_id", deleteUser);
router.get("/eventList", eventList);
router.delete("/deleteEvent/:event_id", deleteEvent);
router.get("/venueList", venueList);
router.delete("/deleteVenue/:venue_id", deleteVenue);
router.get("/eventServiceList", eventServiceList);
router.delete("/deleteEventServices/:event_services_id", deleteEventServices);
router.get("/storiesList", storiesList);
router.delete("/deleteStory/:story_id", deleteStory);
router.get("/shortVidsList", shortVidList);
router.delete("/deleteShortVid/:short_vid_id", deleteShortVid);
router.get("/groupList", groupsList);
router.delete("/deleteGroup/:group_id", deleteGroup);
router.get("/reviewList", reviewsList);
router.get("/groupPostList", groupPostList);
router.delete("/deleteGroupPost/:group_post_id", deleteGroupPost);
router.get("/groupPostCommentList", groupPostCommentList);
router.delete(
  "/deleteGroupPostComment/:group_post_comment_id",
  deleteGroupPostComment
);

router.get("/verifyEventService/:event_services_id", verifyEventService);
router.get("/unVerifyEventService/:event_services_id", unVerifyEventService);
router.get("/blackListEvent/:event_id/:action", blackListEvent);
router.post("/addAdvert", addAdvert);
router.get("/getAdverts", getAdvert);
router.delete("/deleteAd/:ad_id", deleteAdvert);

export default router;
