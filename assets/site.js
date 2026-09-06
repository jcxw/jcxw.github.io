const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.querySelector('span').textContent = open ? 'Menu' : 'Close';
  siteNav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const gallery = document.querySelector('[data-gallery]');
const galleryPhotos = window.GALLERY_PHOTOS ?? [];
const photoViewer = document.querySelector('#photo-viewer');
const photoViewerImage = document.querySelector('[data-photo-viewer-image]');
const photoViewerTitle = document.querySelector('[data-photo-viewer-title]');
const photoViewerSubtitle = document.querySelector('[data-photo-viewer-subtitle]');
let activePhotoIndex = 0;

const showPhoto = (index) => {
  if (!photoViewerImage || !photoViewerTitle || !photoViewerSubtitle || !galleryPhotos.length) return;
  activePhotoIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[activePhotoIndex];
  photoViewerImage.src = photo.src;
  photoViewerImage.width = photo.width;
  photoViewerImage.height = photo.height;
  photoViewerImage.alt = photo.subtitle ? `${photo.caption}, ${photo.subtitle}` : photo.caption;
  photoViewerTitle.textContent = photo.caption;
  photoViewerSubtitle.textContent = photo.subtitle ?? '';
  photoViewerSubtitle.hidden = !photo.subtitle;
};

const openPhotoViewer = (selectedIndex) => {
  if (!photoViewer) return;
  showPhoto(selectedIndex);
  photoViewer.showModal();
  document.body.classList.add('photo-viewer-open');
};

if (gallery) {
  const cards = galleryPhotos.map((photo, index) => {
    const card = document.createElement('figure');
    card.className = 'photo-card';
    card.tabIndex = 0;
    card.role = 'button';
    card.setAttribute('aria-label', `Open ${photo.caption} in the gallery`);

    const image = document.createElement('img');
    image.src = photo.src;
    image.width = photo.width;
    image.height = photo.height;
    image.alt = photo.subtitle ? `${photo.caption}, ${photo.subtitle}` : photo.caption;
    image.decoding = 'async';
    if (index === 0) {
      image.fetchPriority = 'high';
    } else {
      image.loading = 'lazy';
    }

    const caption = document.createElement('figcaption');
    const captionText = document.createElement('span');
    captionText.className = 'photo-caption-title';
    captionText.textContent = photo.caption;
    caption.append(captionText);
    if (photo.subtitle) {
      const subtitle = document.createElement('small');
      subtitle.className = 'photo-caption-subtitle';
      subtitle.textContent = photo.subtitle;
      caption.append(subtitle);
    }
    card.append(image, caption);
    card.addEventListener('click', () => openPhotoViewer(index));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPhotoViewer(index);
      }
    });
    return card;
  });

  gallery.replaceChildren(...cards);
}

document.querySelector('.photo-viewer-close')?.addEventListener('click', () => photoViewer?.close());
document.querySelector('[data-photo-previous]')?.addEventListener('click', () => showPhoto(activePhotoIndex - 1));
document.querySelector('[data-photo-next]')?.addEventListener('click', () => showPhoto(activePhotoIndex + 1));
photoViewer?.addEventListener('click', (event) => {
  if (event.target === photoViewer) photoViewer.close();
});
photoViewer?.addEventListener('close', () => {
  document.body.classList.remove('photo-viewer-open');
});

document.addEventListener('keydown', (event) => {
  if (photoViewer?.open && event.key === 'ArrowLeft') showPhoto(activePhotoIndex - 1);
  if (photoViewer?.open && event.key === 'ArrowRight') showPhoto(activePhotoIndex + 1);
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('span').textContent = 'Menu';
    siteNav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.focus();
  }
});

const essays = {
  afterlife: {
    topic: 'Grief · 8 min read',
    title: 'Afterlife To-Do List',
    deck: 'Compiled by a forty-year-old Singaporean woman who expected grief to be tragic, not administrative. This document is not endorsed by any church, government office, or mental health authority. It records what happened after Mum died, when I found myself running the world’s saddest project plan.',
    sections: [
      {
        title: '1. Inform Every Human You Have Ever Encountered',
        deck: 'You don’t know how connected you are until tragedy broadcasts your entire network like a push notification.',
        body: [
          'Once the first WhatsApp message went out, my phone exploded. My life turned into a class reunion I did not organise.',
          'Friends from three jobs ago. Friends from church. Friends from cities I barely remember living in. And all my exes in the same space, some even brought their new partners.',
          'I thought I was an introvert with a very selective circle. Turns out I was simply delusional. I had been collecting humans the way some people collect stamps.',
          'One friend said, ‘I knew you would need us.’',
          'Another said, ‘I always thought your mum was the kindest person I’ve ever met.’',
          'Someone else arrived with Bengawan Solo Pandan Chiffon cake in case I needed something sweet and fluffy.'
        ]
      },
      {
        title: '2. Entertain The One Guest Who Should Have Stayed Home',
        deck: 'Survive the socially inappropriate visitor as grief does not filter guests.',
        body: [
          'Every funeral has one. Mine was particularly unforgettable.',
          'She arrived in a floral dress, moving with exaggeration. The dress floated although the air was stale.',
          'We had not spoken for years because her husband controlled her social interactions like a human firewall. But apparently attending my mother’s wake was allowed. The logic still escapes me.',
          'She sat down and launched into a ninety-minute monologue about her suffering.',
          'Her in-laws.',
          'Her (sociopathic) husband.',
          'Her housing dilemma.',
          'Her dramatic police stories.',
          'She cried. Incessantly.',
          'She used the tissues set out on the table for mourners, pulling them one after another as if they were unlimited.',
          'I sat there, nodding and patting her hand, wondering when my mother’s wake had turned into a container for other people’s unresolved lives.',
          'Eventually she said, ‘Thank you for listening.’',
          'I stared at her, wondering if listening had ever been optional, but said, ‘You’re welcome.’',
          'Not.'
        ]
      },
      {
        title: '3. Select The Photo That Represents Everything',
        deck: 'Choose one photograph to stand in for sixty-two years of existence.',
        body: [
          'My brother chose the photo. He picked one from Mum’s chemo months. She was in a hawker centre, laughing with a half-bite of food in her cheek and a cider in her hand. The doctor said no drinking. Mum said one cider would not kill her faster.',
          'We cropped out the cider for church optics, but kept her joy.',
          'Visitors kept saying, “She looks so radiant.”',
          'I agreed. I felt like someone was wringing my heart gently every time I looked at it.'
        ]
      },
      {
        title: '4. Decide Whether To Lie About Her Age',
        deck: 'Eventually publish a false age in the national papers.',
        body: [
          'Mum was sixty-two.',
          'Grandma insisted we put sixty-five in the obituary.',
          'According to Grandma, sixty-two is “too young to die”.',
          '“People will say so young die already, so wasted,” she said.',
          'I realised that death does not stop auntie culture.',
          'I let Grandma win.',
          'Who wants to pick a fight with an eighty-four-year-old grieving woman? Not me.'
        ]
      },
      {
        title: '5. Select Flowers That Do Not Resemble A Crime Scene',
        deck: 'A funeral can look like a garden party held by people who refuse to let sadness be ugly.',
        body: [
          'The funeral director offered white lilies. He said white was respectful.',
          'I said white was depressing. A colour that reminded me of hospital curtains and surrendering a war.',
          'I told everyone to bring red roses instead.',
          'Everyone obeyed with militant enthusiasm.',
          'By evening the hall looked spectacular.',
          'Bouquets of roses. Vases packed with roses. A throne of roses surrounding Mum’s photo so lush that many aunties said, “Wah so beautiful.”'
        ]
      },
      {
        title: '6. Choose Her Final Address',
        deck: 'Death and housing share the same national language of scarcity, price charts, and long-term planning.',
        body: [
          'Our church conducted the funeral service but had no columbarium. Very classic Singapore Christian experience.',
          'So we went to the church at Commonwealth Avenue, which accepted everyone as long as you paid.',
          'The basement was air-conditioned and faintly dusty. The niches glowed in neat rows like miniature HDB blocks. Singapore even plans the afterlife in vertical housing.',
          'The caretaker showed us the price chart.',
          'Premium units near the entrance.',
          'Cheaper ones inside the maze.',
          'Lucky numbers cost more.',
          'Numbers associated with ghosts or financial ruin were discounted.',
          'He pointed at a niche and said, “This one good value.”',
          'Singaporeans know a property pitch when they hear one.',
          'My brother and I chose a middle unit. Balanced. Centrally located. Maybe good WiFi.',
          'Signing the papers felt exactly like buying a tiny flat that nobody would ever live in but everyone would visit occasionally.'
        ]
      },
      {
        title: '7. Write The Eulogy And Rewrite It Until You Forget Your Own Name',
        deck: 'Writing about someone you love more than yourself requires emotional CPR.',
        body: [
          'I did not freestyle. I wrote carefully. I rewrote. I edited. I restructured.',
          'I wrote the English version first, then translated it into Mandarin. Then rewrote both again.',
          'At the podium I held two scripts.',
          'The English one neat and church-friendly.',
          'The Mandarin one looking like it had survived a minor typhoon.',
          'I don’t know where I found it in me to write this beautiful line, “Mum outgave, outloved, and outprayed.”',
          'Friends nodded.',
          'Writing somehow surprises me. But this time it felt exceptionally accurate.'
        ]
      },
      {
        title: '8. Pack Her Belongings',
        deck: 'Objects become emotional USB drives.',
        body: [
          'One week after the funeral, Grandma called.',
          '“Have you cleared her things?”',
          'This was her way of saying she cared. In a terrifying way.',
          'I entered Mum’s room.',
          'The air smelled of rose hand cream.',
          'That scent was her signature.',
          'She had used it for years, sparingly, because it was “expensive.”',
          'I opened her wardrobe. Clothes still hung with her quiet orderliness.',
          'Frail fabrics softened by years of wearing and washing.',
          'I touched each sleeve and felt my heart tighten.',
          'Most clothes went to my aunt’s and grandma’s helpers, who sent them back to their families in the Philippines. They cried when they received them. I cried while giving them.',
          'What I kept was her cardigan. The one she wore often during her later chemo months. Her body had grown thinner. Hospitals are freezing. Chemo takes hours. She would shiver slightly, then put on that cardigan, and I would tuck the sleeve properly around her wrist.',
          'During chemo I sat beside her editing my photos on my laptop. Digital nomad perks. I could work anywhere. Even at a cancer centre with infusion pumps ticking beside us.',
          'Now the cardigan lives in a special box on my shelf. I take it out sometimes, just to remember those hours sitting beside her while life was unfair but still tender.'
        ]
      },
      {
        title: '9. Choose Your Memorial Day',
        deck: 'Pick a date to remember her.',
        body: [
          'I refuse the death date.',
          'It belongs to machines, paperwork, and forms.',
          'I choose her birthday instead.',
          'Each year I buy slices of cake to share at our weekly family dinner with Mum’s side of the family.',
          'We eat in quiet remembrance. No candles. No rituals. Just sweetness and memory.',
          'Why remember bad days when you can remember glad days?'
        ]
      },
      {
        title: '10. Accept That This To-Do List Never Actually Ends',
        deck: 'Finish this checklist, then realise it is unfinished forever.',
        body: [
          'Even now, tasks appear. Emotional ones. Spiritual ones. Unexpected ones.',
          'When I smell rose hand cream.',
          'When I tell someone to rest and hear her voice coming out of my throat.',
          'Grief is a department that never closes.',
          'You just learn to work in it without overtime pay.'
        ]
      },
      {
        title: 'Final Declaration',
        body: [
          'I declare all the above true. I declare that comedy is my grief-management system. I declare that Mum raised me with so much love that even death could not delete it.'
        ]
      }
    ]
  }
};

const dialog = document.querySelector('#essay-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogTopic = document.querySelector('#dialog-topic');
const dialogDeck = document.querySelector('#dialog-deck');
const dialogBody = document.querySelector('#dialog-body');

document.querySelectorAll('[data-essay]').forEach((button) => {
  button.addEventListener('click', () => {
    const essay = essays[button.dataset.essay];
    if (!essay || !dialog) return;
    dialogTitle.textContent = essay.title;
    dialogTopic.textContent = essay.topic;
    dialogDeck.textContent = essay.deck;
    const sectionNodes = essay.sections.flatMap((section) => {
      const heading = document.createElement('h3');
      heading.textContent = section.title;
      const nodes = [heading];

      if (section.deck) {
        const deck = document.createElement('p');
        deck.className = 'section-deck';
        deck.textContent = section.deck;
        nodes.push(deck);
      }

      section.body.forEach((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        nodes.push(paragraph);
      });

      return nodes;
    });
    dialogBody.replaceChildren(...sectionNodes);
    dialog.showModal();
  });
});

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
