const headerContent = `
    <h1><img src="https://portfoliobysk.github.io/images/logo.svg" alt="S.K's Portfolio Logo"></h1>
    <nav>
      <a href="#About" class="anchor">About</a>
      <a href="#Profile" class="anchor">Profile</a>
      <a href="#Portfolio" class="anchor">Portfolio</a>
      <a href="https://github.com/portfoliobysk/">GitHub</a>
    </nav>
`;

const breadcrumbContent = () => {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment.length > 0);
    
    let currentPath = '/';
    let breadcrumbHTML = '<ol>';

    breadcrumbHTML += '<li><a href="/">Home</a></li>&nbsp;&gt;&nbsp;';

    pathSegments.forEach((segment, index) => {
        currentPath += segment + '/';
        const isLast = index === pathSegments.length - 1;
        const linkText = document.title.replace(" - S.K's Portfolio", ""); 

        if (!isLast) {
            breadcrumbHTML += `<li><a href="${currentPath}">${linkText}</a></li>&nbsp;&gt;&nbsp;`;
        } else {
            breadcrumbHTML += `<li>` + document.title.replace(" - S.K's Portfolio", "") + `</li>`;
        }
    });

    breadcrumbHTML += '</ol>';

    return breadcrumbHTML;
}

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

    const breadcrumbPlaceholder = document.getElementById('breadcrumb');
    if (breadcrumbPlaceholder) {
        breadcrumbPlaceholder.innerHTML = breadcrumbContent();
    }

    const footerPlaceholder = document.querySelector('footer');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerContent;
    }
        
});