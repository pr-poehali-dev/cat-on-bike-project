import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type GameScreen = 'menu' | 'play' | 'settings' | 'rules' | 'records';

interface StoryNode {
  id: string;
  text: string;
  image?: string;
  choices: { text: string; nextId: string }[];
}

const storyData: Record<string, StoryNode> = {
  start: {
    id: 'start',
    text: 'Ты просыпаешься в тёмной комнате. Единственный источник света - тусклая свеча на столе. Воздух пропитан запахом старых книг и чего-то неизведанного. Ты слышишь тихий скрип половиц за дверью...',
    choices: [
      { text: 'Подойти к двери', nextId: 'door' },
      { text: 'Осмотреть комнату', nextId: 'room' },
      { text: 'Взять свечу', nextId: 'candle' }
    ]
  },
  door: {
    id: 'door',
    text: 'Ты подходишь к двери. Ручка холодная как лёд. За дверью слышны странные звуки - будто кто-то царапает когтями по дереву. Твоё сердце начинает биться быстрее...',
    choices: [
      { text: 'Открыть дверь', nextId: 'open_door' },
      { text: 'Вернуться назад', nextId: 'start' }
    ]
  },
  room: {
    id: 'room',
    text: 'Ты осматриваешь комнату внимательнее. На стенах висят портреты людей с пустыми глазницами. В углу стоит старый сундук, покрытый пылью веков. На столе лежит потрёпанный дневник...',
    choices: [
      { text: 'Открыть сундук', nextId: 'chest' },
      { text: 'Прочитать дневник', nextId: 'diary' },
      { text: 'Вернуться', nextId: 'start' }
    ]
  },
  candle: {
    id: 'candle',
    text: 'Ты берёшь свечу. Её тёплый свет немного успокаивает, но тени в комнате становятся ещё более зловещими. В отражении пламени ты замечаешь что-то странное на стене...',
    choices: [
      { text: 'Подойти к стене', nextId: 'wall' },
      { text: 'Вернуться', nextId: 'start' }
    ]
  },
  open_door: {
    id: 'open_door',
    text: 'Ты медленно открываешь дверь. За ней - длинный коридор, уходящий в темноту. По стенам развешаны факелы, но они горят странным зелёным пламенем. Вдали виднеется силуэт...',
    choices: [
      { text: 'Идти вперёд', nextId: 'corridor' },
      { text: 'Вернуться в комнату', nextId: 'start' }
    ]
  },
  chest: {
    id: 'chest',
    text: 'Ты открываешь сундук. Внутри лежит старая карта и странный амулет в форме черепа. Как только ты касаешься амулета, по комнате проносится холодный ветер...',
    choices: [
      { text: 'Взять амулет', nextId: 'amulet' },
      { text: 'Оставить всё как есть', nextId: 'room' }
    ]
  },
  diary: {
    id: 'diary',
    text: 'Ты открываешь дневник. Последняя запись гласит: "Если ты это читаешь - беги. Они уже здесь. Котик на голове - единственный способ..." Остальное размазано чем-то красным.',
    choices: [
      { text: 'Продолжить исследование', nextId: 'room' },
      { text: 'Попытаться уйти', nextId: 'door' }
    ]
  },
  wall: {
    id: 'wall',
    text: 'При свете свечи ты видишь на стене странные символы. Они начинают светиться, и комната наполняется гулом. Ты чувствуешь, как реальность искажается вокруг тебя...',
    choices: [
      { text: 'Коснуться символов', nextId: 'symbols' },
      { text: 'Отойти', nextId: 'start' }
    ]
  },
  corridor: {
    id: 'corridor',
    text: 'Ты идёшь по коридору. Силуэт становится ближе - это... кошка с черепом на голове? Она мяукает и манит тебя за собой дальше в темноту.',
    choices: [
      { text: 'Следовать за кошкой', nextId: 'follow_cat' },
      { text: 'Вернуться', nextId: 'open_door' }
    ]
  },
  amulet: {
    id: 'amulet',
    text: 'Ты берёшь амулет. Внезапно мир вокруг начинает меняться. Ты видишь проблески прошлого этого места - ритуалы, тени, древние существа. Амулет даёт тебе силу видеть правду...',
    choices: [
      { text: 'Использовать силу амулета', nextId: 'use_amulet' },
      { text: 'Продолжить без него', nextId: 'room' }
    ]
  },
  symbols: {
    id: 'symbols',
    text: 'Как только ты касаешься символов, открывается портал. Сквозь него ты видишь другой мир - мир теней и призраков. Оттуда доносится зов...',
    choices: [
      { text: 'Войти в портал', nextId: 'portal' },
      { text: 'Закрыть портал', nextId: 'start' }
    ]
  },
  follow_cat: {
    id: 'follow_cat',
    text: 'Ты следуешь за загадочной кошкой. Она приводит тебя в огромный зал с троном. На троне сидит скелет в короне. Кошка прыгает к нему и мяукает. "Наконец-то... новый страж прибыл..."',
    choices: [
      { text: 'Принять предложение', nextId: 'accept' },
      { text: 'Отказаться', nextId: 'refuse' }
    ]
  },
  use_amulet: {
    id: 'use_amulet',
    text: 'Амулет начинает светиться. Ты видишь духов, запертых в этом месте веками. Они просят освобождения. У тебя есть сила помочь им...',
    choices: [
      { text: 'Освободить духов', nextId: 'free_spirits' },
      { text: 'Покинуть их', nextId: 'leave_spirits' }
    ]
  },
  portal: {
    id: 'portal',
    text: 'Ты входишь в портал. Мир теней встречает тебя тишиной. Здесь время течёт иначе. Ты понимаешь - это место между мирами. Отсюда можно попасть куда угодно...',
    choices: [
      { text: 'Искать выход', nextId: 'find_exit' },
      { text: 'Остаться исследовать', nextId: 'explore_portal' }
    ]
  },
  accept: {
    id: 'accept',
    text: 'Ты принимаешь роль стража. Кошка прыгает на твою голову, и ты чувствуешь древнюю силу. Теперь ты защищаешь границу между мирами. Твоё приключение только начинается...',
    choices: [
      { text: 'Начать сначала', nextId: 'start' }
    ]
  },
  refuse: {
    id: 'refuse',
    text: 'Ты отказываешься. Скелет вздыхает: "Как и все остальные...". Кошка провожает тебя обратно к началу. Может, в следующий раз ты выберешь иначе?',
    choices: [
      { text: 'Начать сначала', nextId: 'start' }
    ]
  },
  free_spirits: {
    id: 'free_spirits',
    text: 'Ты используешь силу амулета, чтобы освободить духов. Они благодарят тебя и исчезают в свете. Дом начинает рушиться. Ты спасён, но тайна осталась неразгаданной...',
    choices: [
      { text: 'Начать сначала', nextId: 'start' }
    ]
  },
  leave_spirits: {
    id: 'leave_spirits',
    text: 'Ты покидаешь духов их судьбе. Амулет темнеет в твоих руках. Ты находишь выход, но чувство вины не покидает тебя. Что-то изменилось в тебе навсегда...',
    choices: [
      { text: 'Начать сначала', nextId: 'start' }
    ]
  },
  find_exit: {
    id: 'find_exit',
    text: 'После долгих поисков ты находишь выход из мира теней. Ты возвращаешься домой, но воспоминания о том месте не отпускают. Иногда во сне ты всё ещё видишь ту кошку...',
    choices: [
      { text: 'Начать сначала', nextId: 'start' }
    ]
  },
  explore_portal: {
    id: 'explore_portal',
    text: 'Ты решаешь остаться и исследовать мир теней. Здесь столько тайн, столько историй... Ты становишься частью этого места, путешественником между мирами.',
    choices: [
      { text: 'Начать сначала', nextId: 'start' }
    ]
  }
};

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [currentNode, setCurrentNode] = useState('start');
  const [volume, setVolume] = useState(50);

  const handleChoice = (nextId: string) => {
    setCurrentNode(nextId);
  };

  const renderMenu = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#3D2817] to-[#221508]">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl text-primary animate-pulse-glow">
            💀
          </h1>
          <h2 className="text-4xl md:text-5xl text-primary tracking-wider">
            Котик на Голове
          </h2>
          <p className="text-secondary/80 text-sm">
            Приключенческий квест ужасов
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setScreen('play')}
            className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Icon name="Play" className="mr-2" size={24} />
            Играть
          </Button>

          <Button
            onClick={() => setScreen('rules')}
            variant="outline"
            className="w-full h-12 text-base border-primary/50 hover:bg-primary/10"
          >
            <Icon name="BookOpen" className="mr-2" size={20} />
            Правила
          </Button>

          <Button
            onClick={() => setScreen('records')}
            variant="outline"
            className="w-full h-12 text-base border-primary/50 hover:bg-primary/10"
          >
            <Icon name="Trophy" className="mr-2" size={20} />
            Рекорды
          </Button>

          <Button
            onClick={() => setScreen('settings')}
            variant="outline"
            className="w-full h-12 text-base border-primary/50 hover:bg-primary/10"
          >
            <Icon name="Settings" className="mr-2" size={20} />
            Настройки
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGame = () => {
    const node = storyData[currentNode];
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#3D2817] to-[#221508]">
        <div className="w-full max-w-2xl space-y-6">
          <Button
            onClick={() => setScreen('menu')}
            variant="ghost"
            className="mb-4 text-secondary hover:text-primary"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            В меню
          </Button>

          <Card className="bg-card/90 backdrop-blur-sm border-primary/30 p-6 md:p-8 animate-scale-in">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="text-6xl animate-pulse-glow">
                  💀
                </div>
              </div>

              <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center">
                {node.text}
              </p>

              <div className="space-y-3 pt-4">
                {node.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice.nextId)}
                    className="w-full h-auto py-4 px-6 text-left justify-start bg-primary/20 hover:bg-primary/30 border border-primary/50 text-foreground"
                    variant="outline"
                  >
                    <Icon name="ChevronRight" className="mr-2 flex-shrink-0" size={20} />
                    <span className="text-sm md:text-base">{choice.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#3D2817] to-[#221508]">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <Button
          onClick={() => setScreen('menu')}
          variant="ghost"
          className="text-secondary hover:text-primary"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад
        </Button>

        <Card className="bg-card/90 backdrop-blur-sm border-primary/30 p-6">
          <h2 className="text-3xl text-primary mb-6 text-center">Настройки</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-foreground/80 flex items-center">
                <Icon name="Volume2" className="mr-2" size={18} />
                Громкость звука: {volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#3D2817] to-[#221508]">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        <Button
          onClick={() => setScreen('menu')}
          variant="ghost"
          className="text-secondary hover:text-primary"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад
        </Button>

        <Card className="bg-card/90 backdrop-blur-sm border-primary/30 p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl text-primary mb-6 text-center">Правила игры</h2>
          
          <div className="space-y-4 text-foreground/90">
            <div className="space-y-2">
              <h3 className="text-xl text-primary flex items-center">
                <Icon name="Target" className="mr-2" size={20} />
                Цель игры
              </h3>
              <p className="text-sm md:text-base leading-relaxed pl-7">
                Исследуй таинственный дом, делай выборы и раскрой все секреты истории. 
                Каждое решение ведёт к новым поворотам сюжета.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl text-primary flex items-center">
                <Icon name="Gamepad2" className="mr-2" size={20} />
                Как играть
              </h3>
              <ul className="text-sm md:text-base leading-relaxed pl-7 space-y-1">
                <li>• Читай описания ситуаций</li>
                <li>• Выбирай один из предложенных вариантов действий</li>
                <li>• Следи за развитием истории</li>
                <li>• Находи разные концовки</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl text-primary flex items-center">
                <Icon name="Lightbulb" className="mr-2" size={20} />
                Совет
              </h3>
              <p className="text-sm md:text-base leading-relaxed pl-7">
                Нет правильных или неправильных решений - только разные пути. 
                Не бойся экспериментировать и начинать заново!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#3D2817] to-[#221508]">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <Button
          onClick={() => setScreen('menu')}
          variant="ghost"
          className="text-secondary hover:text-primary"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад
        </Button>

        <Card className="bg-card/90 backdrop-blur-sm border-primary/30 p-6">
          <h2 className="text-3xl text-primary mb-6 text-center">Рекорды</h2>
          
          <div className="space-y-4">
            <div className="text-center py-8">
              <Icon name="Trophy" className="mx-auto mb-4 text-primary/50" size={48} />
              <p className="text-foreground/60">
                Начни своё приключение, чтобы установить первый рекорд!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {screen === 'menu' && renderMenu()}
      {screen === 'play' && renderGame()}
      {screen === 'settings' && renderSettings()}
      {screen === 'rules' && renderRules()}
      {screen === 'records' && renderRecords()}
    </>
  );
};

export default Index;
