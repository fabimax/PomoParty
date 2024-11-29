class IntervalCountdown {
    constructor(quickPlayIntervals, countdownElement) {
        // Convert minutes and seconds to just minutes for easier comparison
        this.quickPlayIntervals = quickPlayIntervals.map(interval => ({
            start: interval.startMinutes + (interval.startSeconds / 60),
            end: interval.endMinutes + (interval.endSeconds / 60)
        }));
        this.countdownElement = countdownElement;
        this.timerId = null;
    }

    isInQuickPlayPeriod() {
        const now = new Date();
        const currentMinutes = now.getMinutes() + (now.getSeconds() / 60);

        return this.quickPlayIntervals.some(interval => 
            currentMinutes >= interval.start && currentMinutes < interval.end
        );
    }

    findNextTransition() {
        const now = new Date();
        const currentMinutes = now.getMinutes() + (now.getSeconds() / 60);
        const isInQuickPlay = this.isInQuickPlayPeriod();
        
        let nextTransitionTime = null;
        
        if (isInQuickPlay) {
            // Find when current quickplay period ends
            const currentInterval = this.quickPlayIntervals.find(interval =>
                currentMinutes >= interval.start && currentMinutes < interval.end
            );
            nextTransitionTime = currentInterval.end;
        } else {
            // Find next quickplay period
            const nextInterval = this.quickPlayIntervals
                .find(interval => interval.start > currentMinutes);
            
            // If no next interval in this hour, use first interval in next hour
            nextTransitionTime = nextInterval ? nextInterval.start : (this.quickPlayIntervals[0].start + 60);
        }

        const target = new Date(now);
        const targetMinutes = Math.floor(nextTransitionTime);
        const targetSeconds = Math.round((nextTransitionTime % 1) * 60);
        
        // If we're wrapping to next hour
        if (nextTransitionTime >= 60) {
            target.setHours(target.getHours() + 1);
            target.setMinutes(targetMinutes - 60);
        } else {
            target.setMinutes(targetMinutes);
        }
        target.setSeconds(targetSeconds);
        target.setMilliseconds(0);

        return {
            totalSeconds: Math.max(0, (target - now) / 1000),
            targetTime: target,
            isInQuickPlay
        };
    }

    formatTime(minutes, seconds) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateCountdown() {
        const { totalSeconds, isInQuickPlay } = this.findNextTransition();
        
        if (isInQuickPlay) {
            // Show Quick Play button during specified intervals
            this.countdownElement.innerHTML = `<a href="http://45.76.37.161:8080/"><button id="quick-play">Quick Play</button></a>`;
        } else {
            // Show countdown until next Quick Play period
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);
            this.countdownElement.innerHTML = `Next session in ${this.formatTime(minutes, seconds)}`;
        }
    }

    start() {
        this.updateCountdown();
        this.timerId = setInterval(() => this.updateCountdown(), 1000);
        return () => this.stop();
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
}

// Example usage:
const quickPlayIntervals = [
    { 
        startMinutes: 17, startSeconds: 0,  // 15:30
        endMinutes: 19, endSeconds: 60        // 25:00
    },
    {
        startMinutes: 55, startSeconds: 0,   // 45:00
        endMinutes: 59, endSeconds: 60       // 55:30
    }
];

const countdownTimer = document.getElementById('countdownTimer');
const countdown = new IntervalCountdown(quickPlayIntervals, countdownTimer);
countdown.start();