// Sadə kopyalama müdafiəsi: mətnin seçilməsini, kopyalanmasını və sağ klik menyusunu bloklayır.
// Qeyd: bu, adi istifadəçini saxlayır, lakin brauzerin developer alətlərinə qarşı mütləq qorunma vermir.
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('copy', (e) => e.preventDefault());
document.addEventListener('cut', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'u', 's'].includes(key)) {
        e.preventDefault();
    }
});
