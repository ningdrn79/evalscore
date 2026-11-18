/**
 * KODE GOOGLE APPS SCRIPT (MULTI-KELAS & REALTIME SINKRONISASI)
 * Sistem Penilaian Presentasi Kelompok (Peer Assessment & Guru)
 * 
 * PETUNJUK PEMASANGAN:
 * 1. Buka https://sheets.google.com lalu buat Spreadsheet baru (beri judul: "Rekap Penilaian Presentasi").
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus semua kode yang ada di editor Apps Script, lalu tempel (paste) seluruh kode di bawah ini.
 * 4. Klik ikon Disket (Simpan).
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas > "Penerapan baru" (New deployment).
 *    (Jika sudah pernah deploy, pilih "Kelola penerapan" > Edit ikon pensil > Versi Baru).
 * 6. Klik ikon gerigi di sebelah 'Pilih jenis' > pilih "Aplikasi Web" (Web app).
 * 7. Atur:
 *    - Keterangan: Versi Realtime Multi-Kelas
 *    - Jalankan sebagai (Execute as): Saya (email Anda)
 *    - Siapa yang memiliki akses (Who has access): Siapa saja (Anyone)  <-- WAJIB!
 * 8. Klik "Terapkan" (Deploy). Jika muncul izin akses (Authorization), izinkan (Lanjutan > Buka... > Izinkan).
 * 9. Salin URL Aplikasi Web yang berakhiran "/exec", lalu tempelkan ke aplikasi web Anda melalui tombol "Sheets" di pojok kanan atas!
 */

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet 1: Penilaian_Siswa (11 Kolom termasuk Kelas)
  var sheetVotes = ss.getSheetByName("Penilaian_Siswa");
  if (!sheetVotes) {
    sheetVotes = ss.insertSheet("Penilaian_Siswa");
    sheetVotes.appendRow([
      "Timestamp",
      "Kelas",
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
    sheetVotes.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#dbeafe");
  } else {
    // Auto upgrade jika sheet lama belum ada kolom Kelas
    var hVotes = sheetVotes.getRange(1, 1, 1, Math.max(sheetVotes.getLastColumn(), 1)).getValues()[0];
    if (hVotes.length < 11 || (hVotes[1] && String(hVotes[1]).toLowerCase().indexOf("kelas") === -1)) {
      if (hVotes.length >= 10 && String(hVotes[1]).toLowerCase().indexOf("nama") !== -1) {
        sheetVotes.insertColumnAfter(1);
        sheetVotes.getRange(1, 2).setValue("Kelas").setFontWeight("bold").setBackground("#dbeafe");
      }
    }
  }

  // Sheet 2: Daftar_Kelompok (6 Kolom termasuk Kelas)
  var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
  if (!sheetGroups) {
    sheetGroups = ss.insertSheet("Daftar_Kelompok");
    sheetGroups.appendRow(["ID Kelompok", "Kelas", "Nama Kelompok", "Topik Presentasi", "Anggota", "Nilai Guru"]);
    sheetGroups.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#e0e7ff");
  } else {
    // Auto upgrade jika sheet lama belum ada kolom Kelas
    var hGroups = sheetGroups.getRange(1, 1, 1, Math.max(sheetGroups.getLastColumn(), 1)).getValues()[0];
    if (hGroups.length < 6 || (hGroups[1] && String(hGroups[1]).toLowerCase().indexOf("kelas") === -1)) {
      if (hGroups.length >= 5 && String(hGroups[1]).toLowerCase().indexOf("nama") !== -1) {
        sheetGroups.insertColumnAfter(1);
        sheetGroups.getRange(1, 2).setValue("Kelas").setFontWeight("bold").setBackground("#e0e7ff");
      }
    }
  }
}

// Menangani permintaan GET (untuk membaca data suara dan daftar kelompok ke aplikasi web)
function doGet(e) {
  setupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getData";
  var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;

  if (action === "getData") {
    // 1. Baca Penilaian Siswa
    var sheetVotes = ss.getSheetByName("Penilaian_Siswa");
    var votesData = [];
    if (sheetVotes && sheetVotes.getLastRow() > 1) {
      var lastColV = Math.max(sheetVotes.getLastColumn(), 10);
      var headerV = sheetVotes.getRange(1, 1, 1, lastColV).getValues()[0];
      var hasClassColV = headerV[1] && String(headerV[1]).toLowerCase().indexOf("kelas") !== -1;

      var rows = sheetVotes.getRange(2, 1, sheetVotes.getLastRow() - 1, lastColV).getValues();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (hasClassColV) {
          votesData.push({
            timestamp: r[0],
            className: String(r[1] || "6A"),
            reviewerName: r[2],
            reviewerGroup: r[3],
            targetGroup: r[4],
            scores: [Number(r[5]) || 0, Number(r[6]) || 0],
            totalScore: Number(r[7]) || 0,
            score100: Number(r[8]) || 0,
            proFeedback: r[9] || "",
            conFeedback: r[10] || ""
          });
        } else {
          votesData.push({
            timestamp: r[0],
            className: "6A",
            reviewerName: r[1],
            reviewerGroup: r[2],
            targetGroup: r[3],
            scores: [Number(r[4]) || 0, Number(r[5]) || 0],
            totalScore: Number(r[6]) || 0,
            score100: Number(r[7]) || 0,
            proFeedback: r[8] || "",
            conFeedback: r[9] || ""
          });
        }
      }
    }

    // 2. Baca Daftar Kelompok
    var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
    var groupsData = [];
    if (sheetGroups && sheetGroups.getLastRow() > 1) {
      var lastColG = Math.max(sheetGroups.getLastColumn(), 5);
      var headerG = sheetGroups.getRange(1, 1, 1, lastColG).getValues()[0];
      var hasClassColG = headerG[1] && String(headerG[1]).toLowerCase().indexOf("kelas") !== -1;

      var gRows = sheetGroups.getRange(2, 1, sheetGroups.getLastRow() - 1, lastColG).getValues();
      for (var j = 0; j < gRows.length; j++) {
        var g = gRows[j];
        if (hasClassColG) {
          groupsData.push({
            id: String(g[0]),
            className: String(g[1] || "6A"),
            name: String(g[2] || ""),
            topic: String(g[3] || ""),
            members: String(g[4] || ""),
            teacherScore: Number(g[5]) || 0
          });
        } else {
          groupsData.push({
            id: String(g[0]),
            className: "6A",
            name: String(g[1] || ""),
            topic: String(g[2] || ""),
            members: String(g[3] || ""),
            teacherScore: Number(g[4]) || 0
          });
        }
      }
    }

    var result = {
      status: "success",
      votes: votesData,
      groups: groupsData
    };

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

// Menangani permintaan POST (saat siswa mendaftarkan kelompok baru, mengirim nilai, atau guru mengubah nilai)
function doPost(e) {
  setupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // 1. Mendaftarkan atau Memperbarui Kelompok
    if (action === "registerGroup") {
      var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
      var g = data.group;
      var className = g.className || "6A";
      
      var headerG = sheetGroups.getRange(1, 1, 1, Math.max(sheetGroups.getLastColumn(), 6)).getValues()[0];
      var hasClassColG = headerG[1] && String(headerG[1]).toLowerCase().indexOf("kelas") !== -1;

      // Cek apakah ID kelompok sudah ada untuk update
      var existingRow = -1;
      if (sheetGroups.getLastRow() > 1) {
        var ids = sheetGroups.getRange(2, 1, sheetGroups.getLastRow() - 1, 1).getValues();
        for (var idx = 0; idx < ids.length; idx++) {
          if (String(ids[idx][0]) === String(g.id)) {
            existingRow = idx + 2;
            break;
          }
        }
      }

      var rowData = hasClassColG
        ? [g.id, className, g.name, g.topic || "-", g.members || "-", g.teacherScore !== undefined ? g.teacherScore : 0]
        : [g.id, g.name, g.topic || "-", g.members || "-", g.teacherScore !== undefined ? g.teacherScore : 0];

      if (existingRow > 0) {
        sheetGroups.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
      } else {
        sheetGroups.appendRow(rowData);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Kelompok baru berhasil didaftarkan!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Menghapus Kelompok
    if (action === "deleteGroup") {
      var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
      if (sheetGroups && sheetGroups.getLastRow() > 1) {
        var ids = sheetGroups.getRange(2, 1, sheetGroups.getLastRow() - 1, 1).getValues();
        for (var d = 0; d < ids.length; d++) {
          if (String(ids[d][0]) === String(data.groupId)) {
            sheetGroups.deleteRow(d + 2);
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Kelompok berhasil dihapus!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Siswa mengirimkan penilaian baru (2 Kriteria)
    if (action === "submitVote") {
      var sheetVotes = ss.getSheetByName("Penilaian_Siswa");
      var v = data.vote;
      var classNameV = v.className || "6A";
      
      var headerV = sheetVotes.getRange(1, 1, 1, Math.max(sheetVotes.getLastColumn(), 11)).getValues()[0];
      var hasClassColV = headerV[1] && String(headerV[1]).toLowerCase().indexOf("kelas") !== -1;

      var voteRow = hasClassColV ? [
        new Date().toLocaleString("id-ID"),
        classNameV,
        v.reviewerName,
        v.reviewerGroupName,
        v.targetGroupName,
        v.scores[0],
        v.scores[1],
        v.totalScore,
        v.score100,
        v.proFeedback || "",
        v.conFeedback || ""
      ] : [
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
      ];

      sheetVotes.appendRow(voteRow);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Penilaian berhasil dicatat di Google Sheets!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Guru memperbarui nilai guru untuk kelompok
    if (action === "updateTeacherScore") {
      var sheetGroups = ss.getSheetByName("Daftar_Kelompok");
      if (sheetGroups && sheetGroups.getLastRow() > 1) {
        var lastCol = sheetGroups.getLastColumn();
        var gRows = sheetGroups.getRange(2, 1, sheetGroups.getLastRow() - 1, lastCol).getValues();
        var header = sheetGroups.getRange(1, 1, 1, lastCol).getValues()[0];
        
        var scoreCol = -1;
        for (var c = 0; c < header.length; c++) {
          if (String(header[c]).toLowerCase().indexOf("nilai") !== -1) {
            scoreCol = c + 1;
            break;
          }
        }
        if (scoreCol === -1) scoreCol = lastCol;

        for (var k = 0; k < gRows.length; k++) {
          if (String(gRows[k][0]) === String(data.groupId)) {
            sheetGroups.getRange(k + 2, scoreCol).setValue(data.teacherScore);
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
