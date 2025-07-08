(function() {
    'use strict';
    
    function initializeSystem() {
        const os = new TwahirwaOS();
        os.init();
        
        window.twahirwaOS = os;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSystem);
    } else {
        initializeSystem();
    }
})();
