/**
 * CONFIG.JS - Konfigurasi Konten Birthday Escape Room
 * Anda bisa mengubah pertanyaan, pilihan jawaban, pesan surat, dan foto di bawah ini secara bebas!
 */

window.BIRTHDAY_CONFIG = {
  // Nama Pasangan
  partnerName: "My Love Qurotul Aeni ❤️",
  senderName: "Putra satu-satunya orang yang bikin kamu marah tapi selalu sayang sama kamu💖 ",

  // Tanggal Ulang Tahun (Opsional untuk tampilan)
  birthdayDate: "23 tahun yaa",

  // Kuis Escape Room (3 - 4 Pertanyaan Kenangan)
  quizQuestions: [
    {
      id: 1,
      difficulty: "Soal 1 (Mudah)",
      title: "Momen Pertama Kali",
      question: "Kamu inget ga pertama kali aku mulai topik ke kamu?",
      type: "multiple_choice",
      options: [
        "Lewat dm Instagram ",
        "Ketemu di lift",
        "Ketemu di halaman kampus ",
        "Lewat Whatsapp"
      ],
      correctAnswer: 0, // Indeks jawaban benar (0 = pilihan pertama)
      hint: "Hint: bahas umkm hahaa",
      wrongMessage: "Masa lupa sih? Coba ingat-ingat lagi😜"
    },
    {
      id: 2,
      difficulty: "Soal 2 (Sedang)",
      title: "Makanan & Inside Joke",
      question: "Kapan pertama kali kita makan ice cream bareng?",
      type: "multiple_choice",
      options: [
        "20 Desember 2025",
        "10 Januari 2026",
        "25 Maret 2026",
        "15 Februai 2026"
      ],
      correctAnswer: 3,
      hint: "Hint: kamu bilang Kok org itu dpt yang ada cake nya kita ko ngga! 🍟",
      wrongMessage: "Teteeep aja salah! brangkatnya aga malem woyy "
    },
    {
      id: 3,
      difficulty: "Soal 3 (Spesial)",
      title: "Momen Paling Berkesan",
      question: "kasih pesan kedepanya buat aku dong lopp hehe?",
      type: "text_input",
      // Jawaban apapun akan dianggap benar (wildcard "*") asalkan tidak kosong
      correctAnswer: "*",
      // Target email diam-diam menggunakan FormSubmit API
      sendEmailTarget: "rachmadekaputraramadhan@gmail.com",
      hint: "Hint: jawab jujur ya lopp 🥰",
      wrongMessage: "Jawaban nggak boleh kosong! Kasih alasan yang panjang dongg ❤️"
    }
  ],

  // Surat Ucapan Ulang Tahun (Efek Mesin Ketik)
  letterTitle: "Selamat Ulang Tahun, Sayangku! 🎉",
  letterParagraphs: [
    "Selamat ulang tahun untuk orang paling spesial di hidupku! 🎉✨ Hari ini adalah hari keberuntungan dunia karena menghadirkan kamu yang begitu indah.",
    "Terima kasih ya sudah bertahan, berjuang, dan selalu menebarkan senyum manis kamu sampai detik ini. Kehadiran kamu di hari-hariku jadi lebih berwarna, tenang, dan berarti.",
    "Di umur yang baru ini, aku berdoa semoga kamu selalu diberikan kesehatan, kebahagiaan yang melimpah, kelancaran di setiap impianmu, dan dikelilingi oleh hal-hal baik.",
    "Jangan pernah ragu untuk melangkah, karena apapun yang terjadi, aku akan selalu ada di sini—jadi pendukung nomor satumu, tempat kamu cerita, dan alasan kamu tersenyum",
    "Tapi, kamu tahu kan... ga lama lagi keadaan bakal sedikit beda. Kita bakal ada yang namanya jarak. Bentar lagi kita harus jalanin LDR-an yahh walaupun cuma 30menit perjalanan dan jujur dari aku pasti bakal ada rasa kangen ovt atau lainnya yang beda dari biasanya",
    "Bakal ada hari-hari di mana aku cuma bisa dengar suara kamu lewat telepon atau liat senyum kamu lewat layar HP itupun kalo kamu sempet ngangkat teleponnyaa 😔.",
    "Walaupun nanti ruang dan waktu misahin kita, aku mau kamu tahu kalau rasa sayang dan kepercayaan aku ke kamu nggak akan berkurang sedikit pun.",
    "Aku cuma mau minta satu hal sederhana tapi berarti banget: tolong jaga hati kamu baik-baik buat aku yaaa.",
    "Jangan sampai jarak bikin kita asing, dan jangan biarin ragu merusak apa yang udah kita bangun. Di sini, aku juga janji bakal selalu jaga hati dan komitmen ini cuma buat kamu.",
    "Aku juga mau bilang makasi bangettt udah mau berusaha beradaptasi sama kebiasaan aku yang kadang nyebelin , yang cuek, yang sering ngaret , yang sering overthinking hahaa , mungkin emang ga mudah buat ngelewatin semua itu buttt kamu berhasil melewatinya dan aku bersyukur banget punya kamu .",
    "I love you more than words can express! Aku masih mau buat lebih banyak kenangan indah sama kamu lagi ya!",
    "Sekali lagi, happy birthday ya! Tetap jadi diri kamu yang luar biasa. I'm so proud of you, and I'll always be here for you, no matter how far. ✨❤️"
  ],

  // Galeri Foto Kenangan (Tampilan Grid Tumpukan Polaroid)
  photos: [
    {
      url: "assets/images/1.png",
      title: "Ice 17s Date",
      caption: "Momen mam es pertama kali bareng kamu ga akan pernah lupa yang ini hahaa"
    },
    {
      url: "assets/images/2.png",
      title: "Semhas",
      caption: "Maaf yaa aku datang yang dimana kamu udah setengah perjalanan)."
    },
    {
      url: "assets/images/3.png",
      title: "Wisuda",
      caption: "Peduli apa sama panas jogja, yg penting bisa dateng ke wisuda kamu hahaa and first time ketemu ortu km."
    },
    {
      url: "assets/images/4.png",
      title: "First Fotobox sma my love",
      caption: "First fotobox bareng my love di malam takbir seneng banget"
    },
    {
      url: "assets/images/5.png",
      title: "First ke puncak sosok bareng my love",
      caption: "First dateng ke puncak sosok dapet about you 3 kali"
    }
  ],

  // Galeri Video Kenangan (Tampilan Frame Video Sendiri di Bawah Foto)
  videos: [
    {
      url: "assets/images/Vid.mp4", // Ganti dengan path file video kamu di folder assets/images/
      title: "Backsoundya matiin dlu biar denger yah sayangg🎥",
      caption: "Yang ada kamunya aku masukin semua hahaa , padahal banyak si yang lainnya tapi itu yg aku punya maapin yahh"
    }
  ],

  // Konfigurasi Audio / Musik
  audio: {
    // Bisa diisi dengan path file MP3 lokal (misal: "assets/music/song.mp3") atau URL MP3 online
    customAudioUrl: "assets/images/Shape of My Heart.mp3",
    // Jika customAudioUrl kosong, web akan memainkan melodi piano akustik bawaan secara sintetis!
    useSynthFallback: true
  }
};
