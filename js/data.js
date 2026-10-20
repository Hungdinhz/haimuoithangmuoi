// ==========================================================
// NỘI DUNG CỦA WEB – sửa thoải mái ở đây, không cần đụng code khác.
// ==========================================================

/** Các dòng chữ gõ ở màn mở đầu. Dòng bắt đầu bằng "~" sẽ dùng font viết tay. */
export const INTRO_LINES = [
  "Giữa những ngày bận rộn…",
  "có ai đó vẫn luôn dịu dàng với cả thế giới,",
  "nhưng đôi khi quên dịu dàng với chính mình.",
  "~Hôm nay, hãy để thế giới dịu dàng lại với bạn.",
];

/** Lời chúc trong khu vườn. {name} sẽ được thay bằng tên người xem. */
export const WISHES = [
  "Chúc {name} luôn rạng rỡ như đóa hoa đẹp nhất trong vườn 🌸",
  "Mong mỗi sáng thức dậy, {name} đều thấy mình đáng yêu hơn hôm qua một chút.",
  "Chúc {name} được yêu thương đúng cách, và được là chính mình.",
  "Mong {name} luôn có một người để kể chuyện, và một góc nhỏ để bình yên.",
  "Chúc {name} tiền vào như nước, mụn đi như gió 💸",
  "Chúc {name} ăn hoài không mập, ngủ hoài không trễ deadline 😴",
  "Mong những điều {name} đang cố gắng đều sẽ nở hoa đúng mùa.",
  "Chúc {name} luôn mạnh mẽ khi cần, và được yếu đuối khi muốn.",
  "Mong {name} luôn có trà sữa full topping trong tay 🧋",
  "Chúc {name} gặp toàn người tử tế, và nếu không thì cũng đủ bản lĩnh để bước qua.",
  "Bạn không cần hoàn hảo để xứng đáng được yêu thương. Bạn đã đủ rồi 💗",
  "Chúc {name} luôn giữ được ánh mắt lấp lánh như lần đầu nhìn thấy điều mình thích.",
  "Mong {name} luôn được ưu tiên, kể cả bởi chính mình.",
  "Chúc {name} mỗi ngày đều có một lý do nhỏ để mỉm cười ☀️",
  "Chúc {name} xinh đẹp không cần filter, tự tin không cần ai công nhận.",
  "Mong {name} đi thật xa, ngắm thật nhiều, và luôn có nơi để trở về.",
  "Chúc {name} sức khỏe dồi dào, tâm hồn an yên, ví tiền căng tròn.",
  "Cảm ơn {name} vì đã khiến thế giới này dịu dàng hơn một chút.",
  "Chúc {name} được nghỉ ngơi mà không thấy có lỗi 🌙",
  "Mong {name} luôn dám ước mơ lớn, và có đủ can đảm để theo đuổi nó.",
  "Chúc {name} hôm nay được tặng hoa, ngày mai được tặng quà, ngày kia được tặng cả bầu trời.",
  "Nụ cười của {name} là thứ đẹp nhất mà khu vườn này từng thấy 🌼",
  "Chúc {name} luôn được lắng nghe, được thấu hiểu và được trân trọng.",
  "Mong mọi giông bão chỉ khiến {name} thêm rực rỡ, như hoa sau mưa.",
  "Chúc {name} không phải là \"một nửa\" của ai cả, vì {name} đã là một vẹn tròn.",
  "Chúc {name} luôn có những người bạn sẵn sàng đi ăn lúc 11 giờ đêm 🍜",
  "Mong {name} biết rằng mình quan trọng hơn mình nghĩ rất nhiều.",
  "Chúc {name} công việc thuận lợi, sếp dễ tính, đồng nghiệp dễ thương.",
  "Chúc {name} được sống một cuộc đời mà mình thật sự yêu thích.",
  "Gửi {name} một cái ôm thật chặt qua màn hình 🤗",
  "Mong {name} luôn đủ dịu dàng để yêu, và đủ mạnh mẽ để rời đi khi cần.",
  "Chúc {name} tuổi mới… à nhầm, 20/10 mới thật nhiều niềm vui! 🎉",
  "Chúc {name} luôn được là cô bé vô tư trong lòng những người thương mình.",
  "Mong {name} gặp được những điều tốt đẹp nhất, vì {name} xứng đáng với điều đó.",
  "Chúc {name} mỗi bước chân đều có hoa nở 🌷",
  "Hôm nay {name} không cần làm gì cả, chỉ cần vui thôi là đủ.",
  "Chúc {name} vạn sự như ý, tỷ sự như mơ, triệu triệu bất ngờ ✨",
  "Mong {name} luôn tin rằng mình xinh đẹp, theo cách riêng không ai có được.",
  "Chúc {name} được yêu nhiều hơn cả những gì {name} đã cho đi.",
  "Thế giới cần thêm nhiều người như {name}. Cảm ơn vì {name} đã ở đây 💐",
];

/** Thông điệp ẩn khi trồng đủ số hoa này. */
export const GARDEN_GOAL = 20;

/** Các quẻ trong ống xăm. */
export const FORTUNES = [
  { rank: "THƯỢNG THƯỢNG CÁT", title: "Quẻ Hoa Khôi", text: "Hôm nay nhan sắc tăng 20%, thần thái tăng 10%. Ra đường cẩn thận kẻo người ta nhìn mãi không thôi." },
  { rank: "ĐẠI CÁT", title: "Quẻ Tài Lộc", text: "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin. Ví tiền sắp được ăn no." },
  { rank: "ĐẠI CÁT", title: "Quẻ Đào Hoa", text: "Có người đang thầm nghĩ về bạn. Không phải shipper đâu, là thật đấy 💘" },
  { rank: "CÁT", title: "Quẻ Ẩm Thực", text: "Hôm nay ăn gì cũng ngon, ăn bao nhiêu cũng không lên cân. Thiên thời địa lợi, triển thôi!" },
  { rank: "THƯỢNG CÁT", title: "Quẻ Bình An", text: "Mọi lo lắng sẽ nhẹ đi như mây. Tối nay ngủ một giấc thật ngon, sáng mai mọi thứ sẽ ổn." },
  { rank: "ĐẠI CÁT", title: "Quẻ Quý Nhân", text: "Sắp gặp quý nhân phù trợ. Có thể là người đó đang đọc cùng bạn khung hình này." },
  { rank: "CÁT", title: "Quẻ Thăng Tiến", text: "Công việc hanh thông, deadline tự lùi, sếp tự nhiên dễ tính lạ thường." },
  { rank: "THƯỢNG CÁT", title: "Quẻ Hạnh Phúc", text: "Niềm vui đến từ những điều nhỏ xíu: một ly trà sữa, một tin nhắn, một nụ cười. Hãy để ý nhé." },
  { rank: "ĐẠI CÁT", title: "Quẻ Quà Tặng", text: "Trong 24 giờ tới khả năng cao sẽ được nhận quà. Nếu không có… thì tự thưởng cho mình đi, bạn xứng đáng!" },
  { rank: "CÁT", title: "Quẻ Tự Do", text: "Bạn được phép nói \"không\" với mọi thứ làm bạn mệt mỏi. Hôm nay là ngày của bạn mà." },
  { rank: "THƯỢNG THƯỢNG CÁT", title: "Quẻ Rực Rỡ", text: "Năng lượng tích cực tràn trề. Đi đâu cũng sáng bừng như đèn LED 1000W ✨" },
  { rank: "ĐẠI CÁT", title: "Quẻ Yêu Thương", text: "Bạn được yêu thương nhiều hơn bạn tưởng. Thử nhắn tin cho một người bạn thân xem, sẽ thấy ngay." },
  { rank: "CÁT", title: "Quẻ Sức Khỏe", text: "Khỏe như voi, dẻo như mèo, đẹp như hoa. Nhớ uống đủ nước nhé!" },
  { rank: "THƯỢNG CÁT", title: "Quẻ Ước Mơ", text: "Điều ước vừa khấn đang trên đường đến. Kiên nhẫn một chút, vũ trụ đang gói quà." },
  { rank: "ĐẠI CÁT", title: "Quẻ Nữ Hoàng", text: "Hôm nay bạn là nữ hoàng. Mọi người xung quanh có nghĩa vụ chiều chuộng bạn vô điều kiện 👑" },
];

/** Phiếu đặc quyền trong hộp quà. */
export const COUPONS = [
  { icon: "🍽️", title: "Miễn rửa bát", desc: "Được miễn rửa bát trọn vẹn 1 ngày. Ai phàn nàn sẽ phải rửa thay." },
  { icon: "👑", title: "Một ngày làm công chúa", desc: "Có quyền ra lệnh, được phục vụ tận răng trong 24 giờ." },
  { icon: "🧋", title: "Trà sữa vô hạn", desc: "Đổi được 1 ly trà sữa full topping từ người gửi link này cho bạn." },
  { icon: "🍜", title: "Quyền chọn quán", desc: "Được toàn quyền chọn quán ăn, không ai được nói \"ăn gì cũng được\" rồi chê." },
  { icon: "😴", title: "Ngủ nướng hợp pháp", desc: "Được ngủ tới trưa mà không bị ai gọi dậy hay phán xét." },
  { icon: "🎬", title: "Quyền chọn phim", desc: "Toàn quyền chọn phim, kể cả phim đã xem 10 lần. Người xem cùng không được ngủ gật." },
  { icon: "🤗", title: "Ôm không giới hạn", desc: "Có hiệu lực đổi lấy những cái ôm bất cứ khi nào cần. Không hết hạn." },
  { icon: "🛍️", title: "Đi shopping có người xách đồ", desc: "Có một người xách đồ đi theo, không than mỏi chân, không hỏi \"xong chưa\"." },
  { icon: "💆", title: "Massage vai 15 phút", desc: "Đổi được 15 phút massage vai gáy. Áp dụng sau mỗi ngày làm việc vất vả." },
  { icon: "🙊", title: "Luôn luôn đúng", desc: "Trong 1 ngày, mọi ý kiến của bạn đều đúng. Tuyệt đối không được cãi." },
  { icon: "🥖", title: "Bánh mì (trị giá 10–20k)", desc: "Được HungDinh tặng ngay 1 chiếc bánh mì nóng hổi thơm ngon trị giá 10–20k!", isBanhMi: true },
];

/** Dòng thời gian. Mục cuối cùng (you: true) dùng tên người xem. */
export const TIMELINE = [
  {
    icon: "⚔️", year: "Năm 40",
    name: "Hai Bà Trưng",
    desc: "Trưng Trắc và Trưng Nhị phất cờ khởi nghĩa chống ách đô hộ nhà Đông Hán, giành lại độc lập, mở đầu truyền thống \"giặc đến nhà, đàn bà cũng đánh\".",
  },
  {
    icon: "🐘", year: "Năm 248",
    name: "Bà Triệu (Triệu Thị Trinh)",
    desc: "Cưỡi voi ra trận chống quân Ngô khi mới ngoài hai mươi tuổi.",
    quote: "“Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông…”",
  },
  {
    icon: "🏯", year: "Thế kỷ XI",
    name: "Nguyên phi Ỷ Lan",
    desc: "Thay vua Lý Thánh Tông coi việc triều chính khi vua đi đánh Chiêm Thành, giữ yên đất nước và được nhân dân hết lòng kính phục.",
  },
  {
    icon: "🪶", year: "Cuối thế kỷ XVIII",
    name: "Hồ Xuân Hương",
    desc: "\"Bà chúa thơ Nôm\" với những vần thơ sắc sảo, táo bạo, lên tiếng cho thân phận người phụ nữ trong xã hội xưa.",
  },
  {
    icon: "🐎", year: "Cuối thế kỷ XVIII",
    name: "Nữ đô đốc Bùi Thị Xuân",
    desc: "Nữ tướng tài ba của nhà Tây Sơn, giỏi võ nghệ, nổi tiếng với tài luyện voi chiến.",
  },
  {
    icon: "🌸", year: "20/10/1930",
    name: "Hội Phụ nữ phản đế Việt Nam ra đời",
    desc: "Tổ chức tiền thân của Hội Liên hiệp Phụ nữ Việt Nam được thành lập. Ngày 20/10 từ đó trở thành Ngày Phụ nữ Việt Nam.",
  },
  {
    icon: "🌺", year: "1952",
    name: "Anh hùng Võ Thị Sáu",
    desc: "Người con gái đất Đỏ hiên ngang trước mũi súng kẻ thù ở Côn Đảo khi mới 19 tuổi, tóc vẫn cài một bông hoa.",
  },
  {
    icon: "⭐", year: "1965",
    name: "Nữ tướng Nguyễn Thị Định",
    desc: "Nữ tướng đầu tiên của Quân đội nhân dân Việt Nam, Phó Tư lệnh Quân Giải phóng miền Nam, người khởi xướng phong trào Đồng khởi Bến Tre.",
  },
  {
    icon: "🕊️", year: "1973",
    name: "Bà Nguyễn Thị Bình",
    desc: "Người phụ nữ duy nhất đặt bút ký Hiệp định Paris, góp phần lập lại hòa bình ở Việt Nam.",
  },
  {
    icon: "💗", year: "Hôm nay",
    name: "…và {name}",
    desc: "Không cần cưỡi voi ra trận, mỗi ngày bạn vẫn đang chiến đấu với cuộc sống bằng sự kiên cường và dịu dàng của riêng mình. Bạn cũng là một phần của câu chuyện ấy.",
    you: true,
  },
];

/** Lời chúc gợi ý trong form tạo thiệp. */
export const SUGGESTIONS = [
  "Chúc mừng 20/10! Cảm ơn vì đã luôn ở bên, luôn dịu dàng và mạnh mẽ. Mong mọi điều tốt đẹp nhất sẽ đến với bạn hôm nay và mãi về sau 💐",
  "Mẹ ơi, con chưa nói đủ nhiều nhưng con thương mẹ lắm. Chúc mẹ luôn khỏe, luôn vui và bớt lo cho con một chút nhé ❤️",
  "Gửi cô gái đáng yêu nhất mà mình biết: chúc bạn luôn xinh đẹp, ăn hoài không mập và luôn được yêu thương 🌸",
  "Chúc chị một ngày 20/10 thật rực rỡ! Cảm ơn chị vì đã luôn là chỗ dựa vững chắc cho em 🌷",
  "Chúc cô luôn mạnh khỏe, hạnh phúc và mãi giữ nhiệt huyết với nghề. Cảm ơn cô vì những bài học không chỉ có trong sách vở 📚",
  "Hôm nay là ngày của em. Chúc em luôn cười thật tươi, vì nụ cười của em là điều anh thích nhất trên đời 💗",
  "Chúc bà luôn mạnh khỏe, sống lâu trăm tuổi để kể cho con cháu nghe thật nhiều chuyện ngày xưa 🌼",
  "Gửi đồng nghiệp tuyệt vời: chúc bạn deadline nhẹ nhàng, lương thưởng nặng ký và một ngày 20/10 thật vui 🎉",
];

/** Tên tác giả (người nhận yêu cầu ở bước cuối). */
export const AUTHOR_NAME = "HungDinh";

/** Lời chúc riêng đặc biệt dành tặng bạn nữ ở bước cuối cùng. */
export const FINALE_WISHES = [
  "Gửi riêng tới {name}: Chúc {name} một ngày 20/10 thật rực rỡ, luôn xinh đẹp, bình yên và gặp thật nhiều điều may mắn. Dù hôm nay hay bất kỳ ngày nào trong năm, {name} vẫn luôn xứng đáng được yêu thương và trân trọng nhất! 🌸",
  "Này {name} ơi, cảm ơn {name} đã đi hết khu vườn nhỏ này! Chúc {name} luôn giữ mãi nụ cười tỏa nắng, mọi dự định ấp ủ đều nở hoa rực rỡ và luôn có thật nhiều niềm vui mỗi ngày nhé! 💐",
  "Dành tặng {name} thêm một lời chúc đặc biệt nữa: Mong {name} luôn tự tin, độc lập, hạnh phúc theo cách mình muốn, tiền đầy túi, tim đầy tình và chẳng bao giờ phải buồn phiền! ✨",
  "Chúc {name} ngày 20/10 ngập tràn hoa, quà và những lời ngọt ngào. Hãy luôn dịu dàng với bản thân mình như cách {name} dịu dàng với thế giới nhé! 💗",
  "Gửi {name}: Thế giới đã đẹp hơn rất nhiều vì có sự hiện diện của {name}. Chúc {name} luôn rạng ngời, an nhiên và mọi điều ước hôm nay đều sớm thành hiện thực! 🌷",
];

/** Gợi ý yêu cầu / lời nhắn gửi nhanh tới HungDinh. */
export const QUICK_REQUESTS = [
  "🎁 Mình muốn đổi Phiếu đặc quyền vừa mở được nha!",
  "🧋 Đòi HungDinh 1 ly trà sữa full topping!",
  "🍜 Hôm nào bao mình đi ăn một bữa thật ngon nhé!",
  "🌸 Cảm ơn HungDinh vì món quà 20/10 siêu dễ thương!",
];

