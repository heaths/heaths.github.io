module Liquid
  class YouTube < Tag
    Syntax = /\A(#{QuotedString})/o
    
    attr_reader :id, :title

    def initialize(tag_name, markup, options)
      super

      if markup =~ Syntax
        @id = Expression.parse($1)
        @title = "YouTube Video"

        markup.scan(TagAttributes) do |key, value|
          case key
          when "title"
            @title = Expression.parse(value)
          else
            raise "unknown attribute '#{ key }'"
          end
        end
      else
        raise SyntaxError.new("Syntax error in 'youtube' - Valid syntax: youtube 'id'".freeze)
      end
    end

    def render(context)
      id = context.evaluate(@id).to_s
      title = context.evaluate(@title).to_s
      
      <<~HTML
        <div class="youtube-container">  
          <iframe src="https://www.youtube.com/embed/#{ id }"
                  title="#{ title }"
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>  
          </iframe>  
        </div>
      HTML
    end

    Template.register_tag("youtube".freeze, self)
  end
end
