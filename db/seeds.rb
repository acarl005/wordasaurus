begin
andy = User.create!(
  email: 'andy@example.org',
  password: 'corn'
)
rescue ActiveRecord::RecordInvalid
end

a = Piece.create!(
  content: "\tBacon ipsum dolor amet swine beef corned beef prosciutto meatloaf filet mignon \
beef ribs drumstick bresaola fatback rump jowl ribeye cupim. Sirloin ball tip cow \
rump, boudin pork jerky ham meatloaf tenderloin tail. Ham hock short loin ribeye, \
corned beef boudin tri-tip salami sirloin. Meatloaf shoulder tri-tip pork venison \
doner landjaeger meatball, salami tongue sausage. Tail spare ribs picanha jowl \
landjaeger shank leberkas turkey beef ribeye cupim fatback.\n \
\tShort loin pork chop picanha drumstick brisket chuck. Bacon tail shoulder \
kielbasa, ribeye corned beef spare ribs. Ball tip pancetta tail bacon cupim jerky \
boudin kielbasa short loin pork chop. Andouille ribeye tail short loin sausage, \
bresaola turducken capicola picanha short ribs. Tenderloin jowl tongue short ribs \
shoulder pastrami beef ribs ribeye porchetta, boudin filet mignon shank ground round \
hamburger drumstick. Spare ribs pig cow kielbasa.\n"
)

User.first.pieces << a
