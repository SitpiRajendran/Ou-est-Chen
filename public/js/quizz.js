class Question {
    constructor(text, choices, answer) {
      this.text = text;
      this.choices = choices;
      this.answer = answer;
    }
    isCorrectAnswer(choice) {
      return this.answer === choice;
    }
  }
  let questions = [
    new Question("Quel est le première version du jeu à être sortie ?", ["Noir et Blanc", "Rubis et Saphir", "Vert et Rouge", "X et Y"], "Vert et Rouge"),
    new Question("Quel est le premier Pokémon du pokédex ?", ["Pikachu","Bulbizarre", "Carapuce", "Mew"], "Bulbizarre"),
    new Question("Quand voit-on pour la première fois la mère de sasha ?", ["Episode 1","Episode 2", "Episode 3", "Episode 4"], "Episode 1"),
    new Question("Quel est le premier jeux pokemon sorti sur téléphone ?", ["Camp Pokémon","Pokémon Go", "Pokémon Shuffle", "Magicarp Jump"], "Camp Pokémon"),
    new Question("Combien de carte l\'extension \"XY Evolution\" comporte-t-elle ?", ["52","113", "326", "135"], "113"),
    new Question("Quelle est la première compétence de Magicarpe ?", ["Pistolet à O","Charge", "Bulle d'\'O", "Trempette"], "Trempette"),
    new Question("Quelle est le/la champion/ne qui possède un pokemon possedant \"Lait à boire\" ?", ["Blanche","Pierre", "Peter", "Ondine"], "Blanche"),
    new Question("Combien de génération Pikachu a gardé son cri ?", ["2","5", "7", "8"], "5"),
    new Question("Quelle combinaison rendrait théoriquement un Pokémon invincible ?", ["Munja / Talen Ténacité / Objet Baie prime","Type éléctrique / Talent Garde Mystik / Objet ballon", "Type acier-insecte / Talent torche / Objet reste", "Type ténèbre-spectre / Talent Garde Mystik / Objet rune sort"], "Type éléctrique / Talent Garde Mystik / Objet ballon"),
    new Question("Quel est le seul Pokémon capturé par Sacha lors d\'un épisode censuré en Europe et en Amérique ?", ["Porygon","Tauros", "Lippoutou", "Quartermac"], "Tauros"),

  ];
  
  class Quiz {
    constructor(questions) {
      this.score = 0;
      this.questions = questions;
      this.currentQuestionIndex = 0;
    }
    getCurrentQuestion() {
      return this.questions[this.currentQuestionIndex];
    }
    guess(answer) {
      if (this.getCurrentQuestion().isCorrectAnswer(answer)) {
        this.score++;
      }
      this.currentQuestionIndex++;
    }
    hasEnded() {
      return this.currentQuestionIndex >= this.questions.length;
    }
  }
  
  const display = {
    elementShown: function(id, text) {
      let element = document.getElementById(id);
      element.innerHTML = text;
    },
    endQuiz: function() {
      endQuizHTML = `
        <h1>Quiz terminé ! </h1>
        <br>
        <h3> Votre score est de : ${quiz.score} / ${quiz.questions.length}. La perfection est sûrement la clé 👀</h3>
        <br>
        <a href="/dashboard" class="button is-primary is-vcentered ml-5"> ⬅️ Revenir en arrière</a>
        `;
      this.elementShown("quiz", endQuizHTML);
    },
    question: function() {
      this.elementShown("question", quiz.getCurrentQuestion().text);
    },
    choices: function() {
      let choices = quiz.getCurrentQuestion().choices;
  
      guessHandler = (id, guess) => {
        document.getElementById(id).onclick = function() {
          quiz.guess(guess);
          quizApp();
        }
      }
      // affichage choix + prise en compte du choix
      for(let i = 0; i < choices.length; i++) {
        this.elementShown("choice" + i, choices[i]);
        guessHandler("guess" + i, choices[i]);
      }
    },
    progress: function() {
      let currentQuestionNumber = quiz.currentQuestionIndex + 1;
      this.elementShown("progress", "Question " + currentQuestionNumber + " sur " + quiz.questions.length);
    },
  };
  
  // Game logic
  quizApp = () => {
    if (quiz.hasEnded()) {
      display.endQuiz();
    } else {
      display.question();
      display.choices();
      display.progress();
    } 
  }
  // Create Quiz
  let quiz = new Quiz(questions);
  quizApp();