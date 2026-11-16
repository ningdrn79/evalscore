/**
 * KODE GOOGLE APPS SCRIPT
 * Sistem Penilaian Presentasi Kelompok (Peer Assessment & Guru)
 * 
 * PETUNJUK PEMASANGAN:
 * 1. Buka https://sheets.google.com lalu buat Spreadsheet baru (beri judul: "Rekap Penilaian Presentasi").
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus semua kode yang ada di editor Apps Script, lalu tempel (paste) seluruh kode di bawah ini.
 * 4. Klik ikon Disket (Simpan).
 * 5. Klik tombol "Terapkan" (Deploy) di kanan atas > "Penerapan baru" (New deployment).
 * 6. Klik ikon gerigi di sebelah 'Pilih jenis' > pilih "Aplikasi Web" (Web app).
 * 7. Atur:
 *    - Keterangan: Versi 1
 *    - Jalankan sebagai (Execute as): Saya (email Anda)
 *    - Siapa yang memiliki akses (Who has access): Siapa saja (Anyone)  <-- PENTING!
 * 8. Klik "Terapkan" (Deploy). Jika muncul izin akses (Authorization), izinkan (Lanjutan > Buka... > Izinkan).
 * 9. Salin URL Aplikasi Web yang berakhiran "/exec", lalu tempelkan ke aplikasi web Anda!
 */

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet 1: Penilaian_Siswa (Tempat menampung suara siswa - 2 Kriteria)
  var sheetVotes = ss.getSheetByName("Penilaian_Siswa");
  if (!sheetVotes) {
    sheetVotes = ss.insertSheet("Penilaian_Siswa");
    sheetVotes.appendRow([
      "Timestamp",
      "Nama Penilai",
      "Kelompok Penilai",
      "Kelompok yang Dinilai",
      "Kriteria 1 (Kekompakan & Pembagian Peran)",
      "Kriteria 2 (Penguasaan Materi & Kejelasan)",
      "Total Skor (Maks 8)",
      "Skor Skala 100",
      "Kelebihan",
      "Saran Perbaikan"
    ]);
    sheetVotes.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#dbeafe");
  }

  // Sheet 2: Rekap_Kelompok
  var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
  if (!sheetGroups) {
    sheetGroups = ss.insertSheet("Daftar_Kelompok");
    sheetGroups.appendRow(["ID Kelompok", "Nama Kelompok", "Topik Presentasi", "Anggota", "Nilai Guru"]);
    sheetGroups.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#e0e7ff");
  }
}

// Menangani permintaan GET (untuk membaca data suara dan daftar kelompok ke aplikasi web)
function doGet(e) {
  setupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getData";
  var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;

  if (action === "getData") {
    var sheetVotes = ss.getSheetByName("Penilaian_Siswa");
    var votesData = [];
    if (sheetVotes && sheetVotes.getLastRow() > 1) {
      var rows = sheetVotes.getRange(2, 1, sheetVotes.getLastRow() - 1, 10).getValues();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        votesData.push({
          timestamp: r[0],
          reviewerName: r[1],
          reviewerGroup: r[2],
          targetGroup: r[3],
          scores: [r[4], r[5]],
          totalScore: r[6],
          score100: r[7],
          proFeedback: r[8],
          conFeedback: r[9]
        });
      }
    }

    var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
    var groupsData = [];
    if (sheetGroups && sheetGroups.getLastRow() > 1) {
      var gRows = sheetGroups.getRange(2, 1, sheetGroups.getLastRow() - 1, 5).getValues();
      for (var j = 0; j < gRows.length; j++) {
        var g = gRows[j];
        groupsData.push({
          id: String(g[0]),
          name: String(g[1]),
          topic: String(g[2]),
          members: String(g[3]),
          teacherScore: Number(g[4]) || 0
        });
      }
    }

    var result = {
      status: "success",
      votes: votesData,
      groups: groupsData
    };

    // Dukung JSONP agar bisa diakses langsung dari file:// tanpa terblokir CORS browser
    if (callback) {
      return ContentService.createTextOutput(callback + "(" + JSON.stringify(result) + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var msg = { status: "success", message: "Server Google Apps Script aktif!" };
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + JSON.stringify(msg) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(JSON.stringify(msg))
    .setMimeType(ContentService.MimeType.JSON);
}

// Menangani permintaan POST (saat siswa mengirimkan penilaian baru atau guru menyimpan nilai)
function doPost(e) {
  setupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // 1. Siswa atau perwakilan mendaftarkan kelompok baru
    if (action === "registerGroup") {
      var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
      var g = data.group;
      
      sheetGroups.appendRow([
        g.id,
        g.name,
        g.topic || "-",
        g.members || "-",
        g.teacherScore !== undefined ? g.teacherScore : 0
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Kelompok baru berhasil didaftarkan!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Siswa mengirimkan penilaian baru (2 Kriteria)
    if (action === "submitVote") {
      var sheetVotes = ss.getSheetByName("Penilaian_Siswa");
      var v = data.vote;
      
      sheetVotes.appendRow([
        new Date().toLocaleString("id-ID"),
        v.reviewerName,
        v.reviewerGroupName,
        v.targetGroupName,
        v.scores[0],
        v.scores[1],
        v.totalScore,
        v.score100,
        v.proFeedback || "",
        v.conFeedback || ""
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Penilaian berhasil dicatat di Google Sheets!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Guru memperbarui nilai guru untuk kelompok
    if (action === "updateTeacherScore") {
      var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
      if (sheetGroups && sheetGroups.getLastRow() > 1) {
        var gRows = sheetGroups.getRange(2, 1, sheetGroups.getLastRow() - 1, 5).getValues();
        for (var k = 0; k < gRows.length; k++) {
          if (String(gRows[k][0]) === String(data.groupId)) {
            sheetGroups.getRange(k + 2, 5).setValue(data.teacherScore);
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Nilai guru berhasil diperbarui!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Aksi tidak dikenali." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
