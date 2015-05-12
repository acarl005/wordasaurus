get('/') do
  erb(:index)
end

post('/session') do
  @user = User.where(email: params[:email]).first
  if @user && @user.password == params[:password]
    login(@user)
    redirect('/')
  else
    status(401)
    return 'invalid password'
  end
  status(400)
  return 'email not found'
end

get('/users/current', provides: :json) do
  @user = find_user(current_user)
  p @user.to_json
  return @user.to_json
end

get('/users/:id', provides: :json) do
  @user = find_user(params[:id].to_i)
  return @user.to_json
end

get('/users/:id/pieces', provides: :json) do
  @user = find_user(params[:id].to_i)
  return @user.pieces.to_json
end

get('pieces/:id/syns', provides: :json) do
  @piece = Piece.find(params[:id])
  return @piece.syn_json
end

post('pieces/:id/syns') do
  @piece = Piece.find(params[:id])
  @piece.syn_json = params[:syn_json]
  if @piece.save
    status(200)
  else
    status(400)
  end
end

post('/pieces') do
  @user = find_user(current_user)
  @piece = Piece.new(title: params[:title], content: params[:content])
  if @user.pieces << @piece
    status(200)
  else
    status(401)
  end
end

get('/sample', provides: :json) do
  return {
    noun: {
      syn: [
        "illustration",
        "instance",
        "representative",
        "model",
        "exemplar",
        "good example",
        "deterrent example",
        "lesson",
        "object lesson",
        "case",
        "exercise",
        "admonition",
        "happening",
        "ideal",
        "information",
        "internal representation",
        "mental representation",
        "monition",
        "natural event",
        "occurrence",
        "occurrent",
        "representation",
        "warning",
        "word of advice"
      ]
    }
  }.to_json
end
