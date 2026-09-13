/**
 * Case references for the Safety chapter's "Read More" panel. Facts here
 * are drawn from publicly available investigation reports and reputable
 * reporting, kept general and appropriately hedged where an investigation
 * is still open or a cause was never conclusively established — no
 * invented figures, quotes, or conclusions. See docs/RESEARCH.md-style
 * discipline: source, what's known, what isn't, why it's relevant here.
 */
export interface IncidentCase {
  id: string;
  label: string;
  summary: string;
  whatHappened: string;
  context: string;
  factors: string;
  relevance: string;
  status: string;
}

export const incidentCases: IncidentCase[] = [
  {
    id: "ai171",
    label: "Air India AI171 · Ahmedabad, June 2025",
    summary:
      "A widely reported loss of an Air India aircraft renewed public scrutiny of pre-flight and in-flight risk assessment — the starting question behind this dissertation.",
    whatHappened:
      "On 12 June 2025, a Boeing 787-8 operating as Air India flight AI171 crashed shortly after takeoff from Ahmedabad, India, en route to London. Of 242 occupants, 241 died along with 19 people on the ground.",
    context:
      "India's Aircraft Accident Investigation Bureau (AAIB) released a preliminary report on 12 July 2025. It found that both engine fuel control switches moved from the RUN to the CUTOFF position within about one second of each other shortly after liftoff, and that cockpit audio captured one pilot asking the other why fuel had been cut off, with the other denying having done so.",
    factors:
      "The preliminary report explicitly does not assign cause or apportion blame — the investigation was still active at time of writing, and a final report was expected roughly a year after the event. Any account of this case should be read as provisional.",
    relevance:
      "This dissertation is about predicting loss of separation between aircraft, not single-aircraft systems failures — AI171's cause, whatever it turns out to be, sits outside that scope technically. Its relevance here is the one this project's own opening chapter already states: it is the event that turned a general interest in aviation into a specific question about how early a safety-critical situation can, in principle, be seen coming.",
    status: "Investigation ongoing at time of writing — preliminary findings only, no established cause.",
  },
  {
    id: "tenerife",
    label: "Tenerife · Los Rodeos Airport, March 1977",
    summary:
      "Two aircraft collided on a fog-bound runway in what remains the deadliest accident in aviation history — the event that rewrote cockpit and air-traffic communication protocol worldwide.",
    whatHappened:
      "On 27 March 1977, a KLM Boeing 747 began its takeoff roll at Los Rodeos Airport while a Pan Am 747 was still taxiing on the same runway, in dense fog. The two aircraft collided; 583 people died, making it the deadliest accident in aviation history.",
    context:
      "The airport was congested that day after a bomb threat diverted traffic from a nearby airport. Investigators identified a combination of miscommunication between the KLM crew and air traffic control, ambiguous radio phraseology, and severely limited visibility as central to the accident.",
    factors:
      "Official investigation findings pointed to the KLM captain's premature takeoff decision, a misunderstood ATC clearance, and the absence of ground radar at ​the time to independently verify runway occupancy in poor visibility.",
    relevance:
      "This is the most directly relevant case here: it is fundamentally a loss-of-separation event between two aircraft occupying the same space, driven by a breakdown in situational awareness rather than a single mechanical fault. It's a large part of why post-1977 aviation safety leans so heavily on redundant, independent verification of where every aircraft actually is — the same underlying problem this dissertation approaches computationally.",
    status: "Investigation concluded; findings are long-established public record.",
  },
  {
    id: "mh370",
    label: "Malaysia Airlines MH370 · March 2014",
    summary:
      "A Malaysia Airlines aircraft disappeared from surveillance en route to Beijing and was never conclusively recovered — a stark demonstration of how much aviation safety still depends on continuous, reliable tracking data.",
    whatHappened:
      "On 8 March 2014, Malaysia Airlines flight MH370, a Boeing 777, lost contact with air traffic control less than an hour after departing Kuala Lumpur for Beijing, with 239 people on board. Some debris confirmed to be from the aircraft was later recovered on Indian Ocean coastlines, but the wreckage site was never located and the aircraft's final fate was never conclusively established.",
    context:
      "The aircraft's transponder and communication systems stopped transmitting in a way investigators could not fully explain, and it left conventional radar coverage over open ocean.",
    factors:
      "Multiple official search efforts across several years did not resolve the cause. This remains one of aviation's most significant unresolved cases; no confirmed cause should be stated as fact.",
    relevance:
      "This case doesn't concern conflict prediction directly, but it concerns the same underlying dependency this dissertation's data pipeline has: continuous, trustworthy aircraft surveillance data (the same category of data — ADS-B — that this project's models are trained on). Where that data goes missing or is unreliable, no amount of modelling downstream can compensate for it.",
    status: "Wreckage never fully located; cause never conclusively established.",
  },
];
