// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="前言.html"><strong aria-hidden="true">1.</strong> 前言</a></li><li class="chapter-item expanded affix "><li class="part-title">回望歷史，展望未來</li><li class="chapter-item expanded "><a href="參考書目.html"><strong aria-hidden="true">2.</strong> 參考書目</a></li><li class="chapter-item expanded affix "><li class="part-title">聖經</li><li class="chapter-item expanded "><a href="聖經.html"><strong aria-hidden="true">3.</strong> 聖經</a></li><li class="chapter-item expanded affix "><li class="part-title">百家言</li><li class="chapter-item expanded affix "><li class="part-title">歷史學</li><li class="chapter-item expanded "><a href="歷史.html"><strong aria-hidden="true">4.</strong> 歷史</a></li><li class="chapter-item expanded affix "><li class="part-title">數學</li><li class="chapter-item expanded "><a href="數學.html"><strong aria-hidden="true">5.</strong> 數學</a></li><li class="chapter-item expanded affix "><li class="part-title">物理</li><li class="chapter-item expanded "><a href="物理.html"><strong aria-hidden="true">6.</strong> 物理</a></li><li class="chapter-item expanded affix "><li class="part-title">律法</li><li class="chapter-item expanded "><a href="律法.html"><strong aria-hidden="true">7.</strong> 律法</a></li><li class="chapter-item expanded affix "><li class="part-title">政治</li><li class="chapter-item expanded affix "><li class="part-title">經濟</li><li class="chapter-item expanded affix "><li class="part-title">金融</li><li class="chapter-item expanded affix "><li class="part-title">計算機</li><li class="chapter-item expanded affix "><li class="part-title">人文</li><li class="chapter-item expanded affix "><li class="part-title">組織管理</li><li class="chapter-item expanded affix "><li class="part-title">生物</li><li class="chapter-item expanded affix "><li class="part-title">化學</li><li class="chapter-item expanded affix "><li class="part-title">天文</li><li class="chapter-item expanded affix "><li class="part-title">地理</li><li class="chapter-item expanded affix "><li class="part-title">會計</li><li class="chapter-item expanded affix "><li class="part-title">軍事</li><li class="chapter-item expanded affix "><li class="part-title">時務策</li><li class="chapter-item expanded affix "><li class="part-title">國文</li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
