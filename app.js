// Shared frontend utilities for GameVoucher
// Handles auth guard, user info population, and logout wiring across pages

(function () {
	const protectedPages = new Set([
		'dashboard.html',
		'games.html',
		'Reward.html',
		'vouchers.html',
		'leaderboard.html',
		'history.html',
		'setting.html',
		'flipcoin.html',
		'diceroll.html',
		'memorycard.html',
		'game1.html',
		'game2.html',
		'game3.html',
		'game4.html',
		'game5.html',
		'game6.html'
	]);

	function getFilename() {
		const parts = window.location.pathname.split('/');
		return parts[parts.length - 1] || 'index.html';
	}

	function ensureAuthIfProtected() {
		const filename = getFilename();
		if (protectedPages.has(filename)) {
			const isLoggedIn = localStorage.getItem('loggedIn');
			if (!isLoggedIn) {
				window.location.href = 'login.html';
			}
		}
	}

	function populateUserInfo() {
		const userDataRaw = localStorage.getItem('userData');
		if (!userDataRaw) return;
		try {
			const userData = JSON.parse(userDataRaw);
			const fullName = [userData.firstName || '', userData.lastName || ''].join(' ').trim();
			const initials = ((userData.firstName ? userData.firstName.charAt(0) : '') + (userData.lastName ? userData.lastName.charAt(0) : '')).toUpperCase() || 'GV';

			const nameEl = document.getElementById('userName');
			if (nameEl && fullName) nameEl.textContent = fullName;
			const initialsEl = document.getElementById('userInitials');
			if (initialsEl) initialsEl.textContent = initials;

			if (userData.plan) {
				const planEl = document.getElementById('userPlan');
				if (planEl) {
					const planFormatted = userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1);
					planEl.textContent = planFormatted + ' Plan';
				}
				const creditsEl = document.getElementById('userCredits');
				if (creditsEl) {
					// Always use stored credits if available, otherwise use plan defaults
					let credits = userData.credits;
					if (credits === undefined || credits === null) {
						credits = 100;
						if (userData.plan === 'premium') credits = 300;
						if (userData.plan === 'ultimate') credits = 500;
						// Save the default credits
						userData.credits = credits;
						localStorage.setItem('userData', JSON.stringify(userData));
					}
					creditsEl.textContent = credits;
					console.log('Credits loaded:', credits); // Debug log
				}
			}
		} catch (e) {
			// ignore malformed user data
		}
	}

	function wireLogout() {
		const logoutBtn = document.getElementById('logoutBtn');
		if (!logoutBtn) return;
		logoutBtn.addEventListener('click', function (e) {
			e.preventDefault();
			localStorage.removeItem('loggedIn');
			window.location.href = 'index.html';
		});
	}

	function normalizeLogoLink() {
		// Point logo to dashboard for authenticated users, otherwise index
		const logo = document.querySelector('.logo');
		if (!logo || !(logo instanceof HTMLAnchorElement)) return;
		const isLoggedIn = localStorage.getItem('loggedIn');
		logo.setAttribute('href', isLoggedIn ? 'dashboard.html' : 'index.html');
	}

	function refreshCreditsDisplay() {
		// Function to refresh credits display across all pages
		const userData = JSON.parse(localStorage.getItem('userData') || '{}');
		const creditsEl = document.getElementById('userCredits');
		
		if (creditsEl && userData.credits !== undefined) {
			creditsEl.textContent = userData.credits;
			console.log('Credits refreshed:', userData.credits); // Debug log
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		ensureAuthIfProtected();
		populateUserInfo();
		wireLogout();
		normalizeLogoLink();
	});

	// Make refreshCreditsDisplay available globally
	window.refreshCreditsDisplay = refreshCreditsDisplay;
})();


