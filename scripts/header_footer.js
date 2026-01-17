const icons = `
  <svg xmlns="http://www.w3.org/2000/svg">
    <symbol id="icon__github" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z" />
    </symbol>
    <symbol id="icon__mail" viewBox="0 0 24 24">
      <path fill="currentColor" d="M1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14a1.75 1.75 0 0 1-1.75 1.75H1.75A1.75 1.75 0 0 1 0 18.75v-14C0 3.784.784 3 1.75 3ZM1.5 7.412V18.75c0 .138.112.25.25.25h20.5a.25.25 0 0 0 .25-.25V7.412l-9.52 6.433c-.592.4-1.368.4-1.96 0Zm0-2.662v.852l10.36 7a.25.25 0 0 0 .28 0l10.36-7V4.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Z" />
    </symbol>
  </svg>
`;

const headerContent = `
  <h1><a class="logo" href="/"><img src="https://portfoliobysk.github.io/images/logo.svg" alt="S.K's Portfolio Logo"></a></h1>
  <div class="nav__wrapper">
    <input type="checkbox" id="nav__toggle" hidden>
    <label class="nav__icon" for="nav__toggle">
      <span></span>
      <span></span>
      <span></span>
    </label>
    <div class="overlay"></div>
    <nav>
      <div id="header__nav__contents">
        <a href="/index.html#AboutMe__link">About Me</a>
        <a href="/index.html#skills__link">Skill's</a>
        <a href="/index.html#portfolio__link">Portfolio</a>
        <a href="/index.html#career__link">Career</a>
      </div>
      <div id="header__nav__links">
        <a href="https://github.com/portfoliobysk/">
          <svg class="icon" aria-hidden="true">
             <use href="#icon__github"></use>
          </svg>
        </a>
        <a href="https://forms.gle/CALFLhAjRGj49LZC6">
          <svg class="icon" aria-hidden="true">
             <use href="#icon__mail"></use>
          </svg>
        </a>
      </div>
    </nav>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {});

const breadcrumbContent = () => {
	const path = window.location.pathname;
	const pathSegments = path.split('/').filter((segment) => segment.length > 0);

	let currentPath = '/';
	let breadcrumbHTML = '<ol>';

	breadcrumbHTML += '<li><a href="/">Home</a></li>&nbsp;&gt;&nbsp;';

	pathSegments.forEach((segment, index) => {
		currentPath += segment + '/';
		const isLast = index === pathSegments.length - 1;
		const linkText = document.title.replace(" - S.K's Portfolio", '');

		if (!isLast) {
			breadcrumbHTML += `<li><a href="${currentPath}">${linkText}</a></li>&nbsp;&gt;&nbsp;`;
		} else {
			breadcrumbHTML +=
				`<li>` + document.title.replace(" - S.K's Portfolio", '') + `</li>`;
		}
	});

	breadcrumbHTML += '</ol>';

	return breadcrumbHTML;
};

const footerContent = `
  <div id="footer__copy">
    <a class="logo" href="/"><img src="https://portfoliobysk.github.io/images/logo.svg" alt="S.K's Portfolio Logo"></a>
    <small>&#169; 2025-2026 S.K</small>
  </div>
  <div id="footer__nav__contents">
    <a href="/index.html#AboutMe__link">About Me</a>
    <a href="/index.html#skills__link">Skill's</a>
    <a href="/index.html#portfolio__link">Portfolio</a>
    <a href="/index.html#career__link">Career</a>
    <div id="footer__nav__links">
      <a class="icon__link" href="https://github.com/portfoliobysk/">
        <svg class="icon" aria-hidden="true">
          <use href="#icon__github"></use>
        </svg>  
      </a>
      <a class="icon__link" href="https://forms.gle/CALFLhAjRGj49LZC6">
        <svg class="icon" aria-hidden="true">
          <use href="#icon__mail"></use>
        </svg>
      </a>
    </div>
  </div>
`;

// ページロード後に実行
document.addEventListener('DOMContentLoaded', () => {
	const iconsPlaceholder = document.getElementById('icons');
	if (iconsPlaceholder) {
		iconsPlaceholder.innerHTML = icons;
	}

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

	/*
	 * ハンバーガーメニューのページ内リンクでオーバーレイを閉じるためのスクリプト
	 */
	const toggle = document.getElementById('nav__toggle');
	const nav = document.querySelector('nav');

	if (!toggle || !nav) return;

	nav.addEventListener('click', (e) => {
		const a = e.target.closest('a[href^="#"]');
		if (!a) return;

		toggle.checked = false;
	});
});
