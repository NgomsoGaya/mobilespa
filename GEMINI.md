
### error observed
installHook.js:1 In HTML, whitespace text nodes cannot be a child of <tr>. Make sure you don't have any extra whitespace between tags on each line of your source code.
This will cause a hydration error.

  <App>
    <div className="App">
      <Navbar>
      <main>
        <HeroSection>
        <ServicesSection>
        <HowToBook>
        <AdvantageSection>
        <AboutUsSection>
        <PriceListSection onAddService={function handleAddService}>
          <section className="price-list..." id="price-list...">
            <FadeInOnScroll>
              <motion.div ref={function bound dispatchSetState} animate={{...}} initial="hidden" ...>
                <div style={{opacity:0, ...}} ref={function}>
                  <h2>
                  <p>
                  <div className="price-list...">
                    <div className="price-cate...">
                      <h3>
                      <table className="price-table">
                        <thead>
>                         <tr>
                            <th>
                            <th>
                            <th>
                            <th>
>                           {" "}
                        ...
                    ...
        ...
      ...
overrideMethod	@	installHook.js:1
<tr>		
(anonymous)	@	PriceListSection.jsx:56
PriceListSection	@	PriceListSection.jsx:51
<PriceListSection>		
App	@	App.jsx:36
<App>		
(anonymous)	@	main.tsx:8