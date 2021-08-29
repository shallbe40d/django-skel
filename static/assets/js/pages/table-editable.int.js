$(function () {
	var e = {};
	$(".table-responsive").editable({
		dropdowns: {
			level: ["2단", "3단"],
			position: ["좌측 축베어링 (drvnlsb)", "우측 축베어링 (drvnrsb)", "전동기 부하측 베어링 (mlsb)", "전동기 반부하측 베어링 (mhlsb)", "감속기 1단 피니언 우측 베어링 (d1prb)", "감속기 1단 기어 좌측 베어링 (d1glb)", "감속기 1단 기어 우측 베어링 (d1grb)", "감속기 2단 피니언 좌측 베어링 (d2plb)", "감속기 2단 피니언 우측 베어링 (d2prb)", "감속기 2단 기어 좌측 베어링 (d2glb)", "감속기 2단 기어 우측 베어링 (d2grb)", "감속기 3단 피니언 좌측 베어링 (d3plb)", "감속기 3단 피니언 우측 베어링 (d3prb)", "감속기 3단 기어 좌측 베어링 (d3glb)", "감속기 3단 기어 우측 베어링 (d3grb)"],
			material: ["스틸", "우레탄"],
			ssh: ["허용하지 않습니다.", "허용합니다."],
			set: ["IP", "도메인"],
			time: ["+0900 / 서울"]
		},
		edit: function (t) {
			$(".edit i", this).removeClass("fa-pencil-alt").addClass("fa-save").attr("title", "Save")
		},
		save: function (t) {
			$(".edit i", this).removeClass("fa-save").addClass("fa-pencil-alt").attr("title", "Edit"), this in e && (e[this].destroy(), delete e[this])
		},
		cancel: function (t) {
			$(".edit i", this).removeClass("fa-save").addClass("fa-pencil-alt").attr("title", "Edit"), this in e && (e[this].destroy(), delete e[this])
		}
	})
});
