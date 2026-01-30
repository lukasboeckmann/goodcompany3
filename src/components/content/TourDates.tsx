import styles from './TourDates.module.css';

const TOUR_DATES = [
    { city: "Wien", venue: "Metastadt Open Air", date: "24.07.2026", soldOut: false, label: "BIBIZA" },
    { city: "Hamburg", venue: "MS Dockville", date: "14.08.2026", soldOut: false },
    { city: "Chemnitz", venue: "AJZ Chemnitz", date: "30.09.2026", soldOut: false },
    { city: "Rostock", venue: "M.A.U. Club / Zabrik e.V.", date: "01.10.2026", soldOut: false },
    { city: "Oldenburg", venue: "Kulturetage", date: "02.10.2026", soldOut: false },
    { city: "Kiel", venue: "Die Pumpe", date: "03.10.2026", soldOut: false },
    { city: "Düsseldorf", venue: "Zakk", date: "06.10.2026", soldOut: false },
    { city: "Osnabrück", venue: "Rosenhof GmbH", date: "07.10.2026", soldOut: false },
    { city: "Fulda", venue: "Kulturzentrum Kreuz", date: "08.10.2026", soldOut: false },
    { city: "Reutlingen", venue: "Franz.K", date: "10.10.2026", soldOut: false },
    { city: "Bern", venue: "Bierhübeli", date: "11.10.2026", soldOut: false },
    { city: "Wels", venue: "Alter Schlachthof Wels", date: "14.10.2026", soldOut: false },
    { city: "Oslip", venue: "Cselley Mühle", date: "15.10.2026", soldOut: false },
];

export default function TourDates() {
    return (
        <section className={styles.container}>
            <h2 className={styles.headline}>TOUR 2026</h2>

            <div className={styles.list}>
                {TOUR_DATES.map((show, index) => (
                    <div key={index} className={styles.row}>
                        <div className={styles.date}>{show.date}</div>
                        <div className={styles.city}>{show.city}</div>
                        <div className={styles.venue}>{show.venue}</div>
                        <div className={styles.action}>
                            {show.soldOut ? (
                                <span className={styles.soldOut}>SOLD OUT</span>
                            ) : (
                                <button className={styles.ticketBtn}>TICKETS</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
