const isInView = el => {
  const rect = el.getBoundingClientRect();
  const html = document.documentElement;
  return (
    (rect.top + rect.height) >= 0 &&
    (rect.left + rect.width) >= 0 &&
    rect.top <= (window.innerHeight || html.clientHeight) &&
    rect.left <= (window.innerWidth || html.clientWidth)
  );
};

var attachListener = (el, classes) => {
  const listener = () => {
    if (isInView(el)) {
      classes.forEach(cls => el.classList.add(cls));
      window.removeEventListener('scroll', listener);
    }
  };
  listener();
  window.addEventListener('scroll', listener);
};

const getClasses = directiveArg => {
  let classes;
  if (!directiveArg) {
    classes = [];
  } else if (typeof(directiveArg) === 'string') {
    classes = [directiveArg];
  } else if (directiveArg.constructor === Array) {
    classes = directiveArg;
  } else {
    throw TypeError('directive value must either be undefined, a string, or an array.');
  }
  return classes;
};

var makeDirective = ({ globalClass }) => ({
  inserted: (el, binding) => {
    let classes = getClasses(binding.value);
    if (globalClass) {
      classes = classes.concat(globalClass);
    }

    attachListener(el, classes);
  }
});

var plugin = {
  install: (Vue, {
    directiveName = 'visible-class',
    globalClass
  }) => {
    Vue.directive(directiveName, makeDirective({
      globalClass
    }));
  }
};

export default plugin;
