(() => {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	// Typing effect
	const typed = document.getElementById("typed");
	if (typed && !reduceMotion) {
		const words = typed.dataset.words.split(",");
		let word = 0;
		let chars = words[0].length;
		let deleting = true;

		const tick = () => {
			const current = words[word];
			chars += deleting ? -1 : 1;
			typed.textContent = current.slice(0, chars);

			let delay = deleting ? 50 : 90;
			if (!deleting && chars === current.length) {
				deleting = true;
				delay = 1600;
			} else if (deleting && chars === 0) {
				deleting = false;
				word = (word + 1) % words.length;
				delay = 300;
			}
			setTimeout(tick, delay);
		};
		setTimeout(tick, 1600);
	}

	// Mobile menu
	const toggle = document.querySelector(".nav-toggle");
	const links = document.getElementById("nav-links");
	const setOpen = (open) => {
		toggle.setAttribute("aria-expanded", String(open));
		links.classList.toggle("open", open);
	};
	toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
	links.addEventListener("click", (e) => {
		if (e.target.closest("a")) setOpen(false);
	});

	// Header border once scrolled
	const header = document.querySelector(".site-header");
	const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	// Highlight the nav link for the section in view
	const navLinks = [...links.querySelectorAll("a")];
	const sections = navLinks.map((a) => document.querySelector(a.hash)).filter(Boolean);
	const spy = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				navLinks.forEach((a) => a.classList.toggle("active", a.hash === "#" + entry.target.id));
			});
		},
		{ rootMargin: "-40% 0px -55% 0px" }
	);
	sections.forEach((s) => spy.observe(s));

	// Fade sections in as they scroll into view
	if (!reduceMotion) {
		const reveal = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
						reveal.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 }
		);
		document.querySelectorAll(".section").forEach((el) => {
			el.classList.add("reveal");
			reveal.observe(el);
		});
	}

	document.getElementById("year").textContent = new Date().getFullYear();
})();
