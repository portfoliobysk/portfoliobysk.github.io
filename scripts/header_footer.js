const headerContent = `
    <h1><img src="../../images/logo.svg" alt="S.K's Portfolio Logo"></h1>
    <nav>
      <a href="#About" class="anchor">About</a>
      <a href="#Profile" class="anchor">Profile</a>
      <a href="#Portfolio" class="anchor">Portfolio</a>
      <a href="https://github.com/portfoliobysk/">GitHub</a>
    </nav>
`;

const footerContent = `
    <small>&#169; 2025 S.K</small>
    <div id="footer__nav">
        <a href="#About">About</a>
        <a href="#Profile">Profile</a>
        <a href="#Portfolio">Portfolio</a>
        <a href="https://github.com/portfoliobysk/">GitHub</a>
    </div>
`;

// ページロード後に実行
document.addEventListener('DOMContentLoaded', () => {

    const headerPlaceholder = document.querySelector('header');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerContent;
    }

    const footerPlaceholder = document.querySelector('footer');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerContent;
    }
});