export default [
	{
		idioma_sigla: "fr",
		idioma: "frances",
		modos: [
				{
					modo: "indicatif",
					ordem_tempos: ["présent", "passé composé", "imparfait", "plus-que-parfait", "passé simple", "passé antérieur", "futur simple", "futur antérieur"],
					ordenacao: [
						{
							tempos: ["présent", "imparfait", "passé simple", "futur simple"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["passé composé"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							auxs: ["ai", "as", "a", "avons", "avez", "ont"],
							elementos: ["pessoas", "auxs", "conjugado"]
						},
						{
							tempos: ["plus-que-parfait"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							auxs: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
							elementos: ["pessoas", "auxs", "conjugado"]
						},
						{
							tempos: ["passé antérieur"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							auxs: ["eus", "eus", "eut", "eûmes", "eûtes", "eurent"],
							elementos: ["pessoas", "auxs", "conjugado"]
						},
						{
							tempos: ["futur antérieur"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							auxs: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
							elementos: ["pessoas", "auxs", "conjugado"]
						}
					]
				},
				{
					modo: "subjonctif",
					ordem_tempos: ["présent", "passé", "imparfait", "plus-que-parfait"],
					ordenacao: [
						{
							tempos: ["présent", "imparfait"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["passé"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							auxs: ["aie", "aies", "ait", "ayons", "ayez", "aient"],
							elementos: ["pessoas", "auxs", "conjugado"]
						},
						{
							tempos: ["plus-que-parfait"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							auxs: ["eusse", "eusses", "eût", "eussions", "eussiez", "eussent"],
							elementos: ["pessoas", "auxs", "conjugado"]
						}
					]
				},
				{
					modo: "conditionnel",
					ordem_tempos: ["présent", "passé 1ère forme"],
					ordenacao: [
						{
							tempos: ["présent"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["passé 1ère forme"],
							pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
							auxs: ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
							elementos: ["pessoas", "auxs", "conjugado"]
						}
					]
				},
				{
					modo: "impératif",
					ordem_tempos: ["présent"],
					ordenacao: [
						{
							tempos: ["présent"],
							pessoas: ["tu", "nous", "vous"],
							elementos: ["pessoas", "conjugado"]
						}
					]
				}	
		]
	},
	{
		idioma_sigla: "en",
		idioma: "ingles",
		modos: [
				{
					modo: "indicative",
					ordem_tempos: ["simple present", "present continuous", "simple past", "past continous", "present perfect", "present perfect continuous", "past perfect", "past perfect continuous", "future", "future continuous", "future perfect", "future perfect continuous"],
					ordenacao: [
						{
							tempos: ["simple present"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["present continuous"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["am", "are", "is", "are", "are", "are"],
							elementos: ["pessoas", "gerundio"]
						},
						{
							tempos: ["simple past"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							elementos: ["pessoas", "participio"]
						},
						{
							tempos: ["past continous"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["was", "were", "was", "were", "were", "were"],
							elementos: ["pessoas", "auxs", "participio"]
						},
						{
							tempos: ["present perfect"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["have", "have", "has", "have", "have", "have"],
							elementos: ["pessoas", "auxs", "participio"]
						},
						{
							tempos: ["present perfect continuous"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["have been", "have been", "has been", "have been", "have been", "have been"],
							elementos: ["pessoas", "auxs", "gerundio"]
						},
						{
							tempos: ["past perfect"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
              aux: ["had", "had", "had", "had", "had", "had"],
							elementos: ["pessoas", "aux", "participio"]
						},
						{
							tempos: ["past perfect continuous"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
              aux: ["had been", "had been", "had been", "had been", "had been", "had been"],
							elementos: ["pessoas", "aux", "gerundio"]
						},
						{
							tempos: ["future"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["will", "will", "will", "will", "will", "will"],
							elementos: ["pessoas", "auxs", "infinitivo"]
						},
						{
							tempos: ["future continuous"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["will be", "will be", "will be", "will be", "will be", "will be"],
							elementos: ["pessoas", "auxs", "gerundio"]
						},
						{
							tempos: ["future perfect"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["will have", "will have", "will have", "will have", "will have", "will have"],
							elementos: ["pessoas", "auxs", "participio"]
						},
						{
							tempos: ["future perfect continuous"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["will have been", "will have been", "will have been", "will have been", "will have been", "will have been"],
							elementos: ["pessoas", "auxs", "gerundio"]
						}
					]
				},
				{
					modo: "conditional",
					ordem_tempos: ["simple", "progressive", "perfect", "perfect progressive"],
					ordenacao: [
						{
							tempos: ["simple"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["would", "would", "would", "would", "would", "would"],
							elementos: ["pessoas", "auxs", "infinitivo"]
						},
						{
							tempos: ["progressive"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["would be", "would be", "would be", "would be", "would be", "would be"],
							elementos: ["pessoas", "auxs", "gerundio"]
						},
						{
							tempos: ["perfect"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["would have", "would have", "would have", "would have", "would have", "would have"],
							elementos: ["pessoas", "auxs", "participio"]
						},
						{
							tempos: ["perfect progressive"],
							pessoas: ["I", "you", "he/she/it", "we", "you", "they"],
							auxs: ["would have been", "would have been", "would have been", "would have been", "would have been", "would have been"],
							elementos: ["pessoas", "auxs", "gerundio"]
						}
					]
				}
			]
	},
		{
			idioma_sigla: "es",
			idioma: "espanhol",
			modos: [
				{
					modo: "indicativo",
					ordem_tempos: ["presente", "pretérito perfecto compuesto", "pretérito imperfecto", "pretérito pluscuamperfecto", "pretérito perfecto simple", "pretérito anterior", "futuro", "futuro perfecto"],
					ordenacao: [
						{
							tempos: ["presente", "pretérito imperfecto", "pretérito perfecto simple", "futuro"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["pretérito perfecto compuesto"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_auxs: ["he", "has", "ha", "hemos", "habéis", "han"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						},
						{
							tempos: ["pretérito pluscuamperfecto"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_auxs: ["había", "habías", "había", "habíamos", "habíais", "habían"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						},
						{
							tempos: ["pretérito anterior"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_auxs: ["hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						},
						{
							tempos: ["futuro perfecto"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_auxs: ["habré", "habrás", "habrá", "habremos", "habréis", "habran"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						}
					]
				},
				{
					modo: "condicional",
					ordem_tempos: ["simple", "compuesto"],
					ordenacao: [
						{
							tempos: ["simple"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["compuesto"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_aux: ["habría", "habrías", "habrías", "habríamos", "habríais", "habrían"],
							elementos: ["pessoas", "verb_aux", "participio"]
						}
					]
				},
				{
					modo: "subjuntivo",
					ordem_tempos: ["presente", "pretérito perfecto", "pretérito imperfecto 1", "pretérito imperfecto 2", "pretérito pluscuamperfecto 1", "pretérito pluscuamperfecto 2", "futuro", "futuro perfecto"],
					ordenacao: [
						{
							tempos: ["presente", "pretérito imperfecto 1", "pretérito imperfecto 2", "futuro"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["pretérito perfecto"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_aux: ["haya", "hayas", "haya", "hayamos", "hayáis", "hayan"],
							elementos: ["pessoas", "verb_aux", "participio"]
						},
						{
							tempos: ["pretérito pluscuamperfecto 1"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_aux: ["hubiera", "hubieras", "hubiera", "hubiéramos", "hubierais", "hubieran"],
							elementos: ["pessoas", "verb_aux", "participio"]
						},
						{
							tempos: ["pretérito pluscuamperfecto 2"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_aux: ["hubiese", "hubieses", "hubiese", "hubiésemos", "hubieseis", "hubiesen"],
							elementos: ["pessoas", "verb_aux", "participio"]

						},
						{
							tempos: ["futuro perfecto"],
							pessoas: ["yo", "tú", "él/ella", "nosotros(as)", "vosotros(as)", "ellos/ellas"],
							verb_aux: ["hubiere", "hubieres", "hubiere", "hubiéremos", "hubiereis", "hubieren"],
							elementos: ["pessoas", "verb_aux", "participio"]
						}
					]
				},
				{
					modo: "imperativo",
					ordem_tempos: ["imperativo"],
					ordenacao: [
						{
							tempos: ["imperativo"],
							pessoas: ["tú", "usted", "nosotros(as)", "vosotros(as)", "ustedes"],
							elementos: ["pessoas", "conjugado"]
						}
					]
				}
			]
		},
		{
			idioma_sigla: "pt",
      idioma: "portugues",
      modos: [
        {
          modo: "indicativo",
          ordem_tempos: ["presente", "pretérito imperfeito", "pretérito perfeito simples", "pretérito mais-que-perfeito simples", "futuro do presente", "futuro do pretérito"],
          ordenacao: [
            {
              tempos: ["presente", "pretérito imperfeito", "pretérito perfeito simples", "pretérito mais-que-perfeito simples", "futuro do presente", "futuro do pretérito"],
              pessoas: ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
              elementos: ["pessoas", "conjugado"]
            }
          ]
        },
        {
          modo: "subjuntivo",
          ordem_tempos: ["presente", "pretérito imperfeito", "futuro"],
          ordenacao: [
            {
              tempos: ["presente"],
              pessoas: ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
              particulas: ["que", "que", "que", "que", "que", "que"],
              elementos: ["particulas", "pessoas", "conjugado"]
            },
            {
              tempos: ["pretérito imperfeito"],
              pessoas: ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
              particulas: ["se", "se", "se", "se", "se", "se"],
              elementos: ["particulas", "pessoas", "conjugado"]
            },
            {
              tempos: ["futuro"],
              pessoas: ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
              particulas: ["quando", "quando", "quando", "quando", "quando", "quando"],
              elementos: ["particulas", "pessoas", "conjugado"]
            }
          ]
        },
        {
          modo: "imperativo",
          ordem_tempos: ["afirmativo", "negativo"],
          ordenacao: [
            { 
              tempos: ["afirmativo"],
              pessoas: ["tu", "você", "nós", "vós", "vocês"],
              elementos: ["conjugado", "pessoas"]
            },
            {
              tempos: ["negativo"],
              pessoas: ["tu", "você", "nós", "vós", "vocês"],
              particulas: ["não", "não", "não", "não", "não"],
              elementos: ["particulas", "conjugado", "pessoas"]
            }
          ]
        }
      ]
    },
		{
			idioma_sigla: "it",
			idioma: "italiano",
			modos: [
				{
					modo: "indicativo",
					ordem_tempos: ["presente", "passato prossimo", "imperfetto", "trapassato prossimo", "passato remoto", "trapassato remoto", "futuro semplice", "futuro anteriore"],
					contrapartida_pt: [{m: 0, t: 0}, {m: '-', t: '-'}, {m: 0, t: 1}, {m: '-', t: '-'}, {m: 0, t: 2}, {m: 0, t: 3}, {m: 0, t: 4}, {m: '-', t: '-'}],
					ordenacao: [
						{
							tempos: ["presente", "imperfetto", "passato remoto", "futuro semplice"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["passato prossimo"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							verb_auxs: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						},
						{
							tempos: ["trapassato prossimo"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							verb_auxs: ["avevo", "avevi", "aveva", "avevamo", "avevate", "avevano"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						},
						{
							tempos: ["trapassato remoto"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							verb_auxs: ["ebbi", "avesti", "ebbe", "avemmo", "aveste", "ebbero"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						},
						{
							tempos: ["futuro anteriore"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							verb_auxs: ["avrò", "avrai", "avrà", "avremo", "avrete", "avranno"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						}
					]
				},
				{
					modo: "congiuntivo",
					ordem_tempos: ["presente", "passato", "imperfetto", "trapassato"],
					contrapartida_pt: [{m: 1, t: 0}, {m: '-', t: '-'}, {m: 1, t: 1}, {m: '-', t: '-'}],
					ordenacao: [
						{
							tempos: ["presente", "imperfetto"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["passato"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							verb_auxs: ["abbia", "abbia", "abbia", "abbiamo", "abbiate", "abbiano"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						},
						{
							tempos: ["trapassato"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							verb_auxs: ["avessi", "avessi", "avesse", "avessimo", "aveste", "avessero"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						}
					]
				},
				{
					modo: "condizionale",
					ordem_tempos: ["presente", "passato"],
					contrapartida_pt: [{m: '-', t: '-'}, {m: '-', t: '-'}],
					ordenacao: [
						{
							tempos: ["presente"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							elementos: ["pessoas", "conjugado"]
						},
						{
							tempos: ["passato"],
							pessoas: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
							verb_auxs: ["avrei", "avresti", "avrebbe", "avremmo", "avreste", "avrebbero"],
							elementos: ["pessoas", "verb_auxs", "participio"]
						}
					]
				},
				{
					modo: "imperativo",
					ordem_tempos: ["imperativo"],
					contrapartida_pt: [{m: 2, t: 0}],
					ordenacao: [
						{
							tempos: ["imperativo"],
							pessoas: ["tu", "lui/lei", "noi", "voi", "loro"],
							elementos: ["pessoas", "conjugado"]
						}
					]
				}
			]
		},
		{
			idioma_sigla: "de",
			idioma: "alemão",
			modos: [
				{
					modo: "indicative_active",
					ordem_tempos: ["present", "imperfect", "perfect", "plusquamperfect", "future", "future_perfect"],
					ordenacao: [
						{
							tempos: ["present", "imperfect"],
							pessoas: ["ich", "du", "er", "wir", "ihr", "sie"],
							elementos: ["pessoas", "conjugado"]
						}
					]
				}
			]
		}
]