const themeButton = document.getElementById('theme-button');
      const darkTheme = "dark";
      const iconTheme = "fa-sun";
      // Activate / deactivate the theme manually with the button
        themeButton.addEventListener("click", () => {
          // console.log('hello')
        // Add or remove the dark / icon theme
        document.body.classList.toggle(darkTheme);
        themeButton.classList.toggle(iconTheme);
        //Saving the current data to the localStorage
        localStorage.setItem("selected-theme", getCurrentTheme());
        localStorage.setItem("selected-icon", getCurrentIcon());
      });

      const getCurrentTheme = () =>
        document.body.classList.contains(darkTheme) ? "dark" : "light";
      const getCurrentIcon = () =>
        themeButton.classList.contains(iconTheme) ? "fa-moon" : "fa-sun";

      // Fetch data from localStorage on the browser
      const selectedTheme = localStorage.getItem("selected-theme");
      const selectedIcon = localStorage.getItem("selected-icon");

      // if the current selectedTheme is dark activated else deactived
      if (selectedTheme) {
        document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
          darkTheme
        );
        themeButton.classList[selectedIcon === "fa-moon" ? "add" : "remove"](
          iconTheme
        );
      }
