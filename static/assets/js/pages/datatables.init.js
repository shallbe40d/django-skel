$(document).ready(function () {
	$("#datatable").DataTable(), $("#datatable-buttons").DataTable({
		lengthChange: !1,
		buttons: ["copy", "excel", "pdf", "colvis"]
	}).buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)"), $(".dataTables_length select").addClass("form-select form-select-sm")
});


$(document).ready(function() {
	$("#userList").DataTable({
		order: [[5, 'desc']],
		ordering: true,
		pageLength: 20,
		serverSide: false,
		select: true,
		lengthMenu:  [20, 40, 60, 80, 100 ],
		dom:
			"<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row mb-4'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
		language: {
			zeroRecords: "데이터가 존재하지 않습니다.",
			search: "",
			searchPlaceholder: "검색어 입력",
			lengthMenu: "_MENU_ 개 보기",
			paginate: {
				first:"맨앞",
				previous:"이전",
				next: "다음",
				last:"맨뒤"
			}
		}
	});
});
$(document).ready(function() {
	$("#ipList").DataTable({
		order: [[0, 'desc']],
		ordering: true,
		pageLength: 20,
		serverSide: false,
		select: true,
		lengthMenu:  [20, 40, 60, 80, 100 ],
		dom:
			"<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row mb-4'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
		language: {
			zeroRecords: "설정된 IP 가 없습니다.",
			search: "",
			searchPlaceholder: "검색어 입력",
			lengthMenu: "_MENU_ 개 보기",
			paginate: {
				first:"맨앞",
				previous:"이전",
				next: "다음",
				last:"맨뒤"
			}
		}
	});
});
$(document).ready(function() {
	$("#systemList").DataTable({
		order: [[0, 'desc']],
		ordering: true,
		pageLength: 20,
		serverSide: false,
		select: true,
		lengthMenu:  [20, 40, 60, 80, 100 ],
		dom:
			"<'row'<'col-sm-12'tr>>" +
			"<'row mb-4'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
		language: {
			zeroRecords: "설정된 IP 가 없습니다.",
			search: "",
			searchPlaceholder: "검색어 입력",
			lengthMenu: "_MENU_ 개 보기",
			paginate: {
				first:"맨앞",
				previous:"이전",
				next: "다음",
				last:"맨뒤"
			}
		}
	});
});
$(document).ready(function() {
	$("#sensorList1").DataTable({
		order: [[1, 'desc']],
		ordering: true,
		pageLength: 20,
		serverSide: false,
		select: true,
		lengthMenu:  [20, 40, 60, 80, 100 ],
		dom:
			"<'row'<'col-sm-12'tr>>" +
			"<'row mb-4'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
		language: {
			zeroRecords: "설정된 IP 가 없습니다.",
			search: "",
			searchPlaceholder: "검색어 입력",
			lengthMenu: "_MENU_ 개 보기",
			paginate: {
				first:"맨앞",
				previous:"이전",
				next: "다음",
				last:"맨뒤"
			}
		}
	});
});
$(document).ready(function() {
	$("#sensorList2").DataTable({
		order: [[1, 'desc']],
		ordering: true,
		pageLength: 20,
		serverSide: false,
		select: true,
		lengthMenu:  [20, 40, 60, 80, 100 ],
		dom:
			"<'row'<'col-sm-12'tr>>" +
			"<'row mb-4'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
		language: {
			zeroRecords: "설정된 IP 가 없습니다.",
			search: "",
			searchPlaceholder: "검색어 입력",
			lengthMenu: "_MENU_ 개 보기",
			paginate: {
				first:"맨앞",
				previous:"이전",
				next: "다음",
				last:"맨뒤"
			}
		}
	});
});
